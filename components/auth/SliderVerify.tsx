'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './slider-verify.module.scss';
import { authService } from '@/modules/auth/authService';
import Image from 'next/image';

interface SliderVerifyProps {
  userId: string; // 用户ID
  onSuccess: (captchaId: string, sliderLeft: number) => void;
  onFail?: () => void;
}

/**
 * 滑块验证组件
 */
const SliderVerify: React.FC<SliderVerifyProps> = ({ userId, onSuccess, onFail }) => {
  const isDraggingRef = useRef(false); // 是否正在拖动滑块
  const [position, setPosition] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0)
  const [isVerified, setIsVerified] = useState(false);;
  const [captchaId, setCaptchaId] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [blockImage, setBlockImage] = useState('');
  const [bgWidth, setBgWidth] = useState(0);
  const [bgHeight, setBgHeight] = useState(0);
  const [blockWidth, setBlockWidth] = useState(0);
  const [blockHeight, setBlockHeight] = useState(0);
  const [blockY, setBlockY] = useState(0);
  const [loading, setLoading] = useState(true);
  // 使用useRef替代普通变量，确保值在组件生命周期内持久存在
  const sliderPositionRef = useRef(0);
  // 添加一个 ref 来跟踪当前的 userId，避免重复请求
  const currentUserIdRef = useRef<string>('');
  // 添加一个 ref 来跟踪是否已经请求过验证码
  const captchaRequestedRef = useRef<boolean>(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 组件加载时获取验证码，但只在 userId 存在时才获取
  useEffect(() => {
    // 如果userId不存在，重置状态
    if (!userId) {
      setIsVerified(false);
      setSliderLeft(0);
      setPosition(0);
      setCaptchaId('');
      setBackgroundImage('');
      setBlockImage('');
      setLoading(false);
      captchaRequestedRef.current = false;
      currentUserIdRef.current = '';
      return;
    }
    
    // 如果userId没有变化且已经请求过验证码，不重复请求
    if (userId === currentUserIdRef.current && captchaRequestedRef.current) {
      return;
    }
    
    // 更新当前userId和请求状态
    currentUserIdRef.current = userId;
    captchaRequestedRef.current = true;
    
    // 重置组件状态
    setIsVerified(false);
    setSliderLeft(0);
    setPosition(0);
    
    // 获取新的验证码
    fetchCaptcha();
    
    // 组件卸载时清理状态
    return () => {
      // 不重置captchaRequestedRef，让它在组件生命周期内保持
    };
  }, [userId]);
  
  // 获取滑块数据
  const fetchCaptcha = async () => {
    setLoading(true);
    try {
      const captchaData = await authService.getCaptcha();
      if (captchaData) {
        setCaptchaId(captchaData.id);
        setBackgroundImage(captchaData.background);
        setBlockImage(captchaData.block);
        setBgWidth(captchaData.bg_width);
        setBgHeight(captchaData.bg_height);
        setBlockWidth(captchaData.bl_width);
        setBlockHeight(captchaData.bl_height);
        setBlockY(captchaData.bl_y);
        setLoading(false);
      }
    } catch (error) {
      console.error('获取滑块失败:', error);
      setLoading(false);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVerified || loading) return;
    isDraggingRef.current = true; // 设置拖动状态
    e.preventDefault(); // 阻止默认行为
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isVerified || loading) return;
    // 只对滑块按钮触摸事件进行处理，不阻止其他元素的默认行为
    isDraggingRef.current = true; // 设置拖动状态
    // 使用 passive: false 来允许阻止默认行为
    document.addEventListener('touchmove', handleTouchMove, { passive: false } as EventListenerOptions);
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault(); // 阻止默认行为
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const sliderWidth = 40; // 滑块宽度
    const trackWidth = containerRect.width; // 滑动轨道宽度
    const maxWidth = trackWidth - sliderWidth; // 最大滑动距离
    
    // 计算滑块位置
    let newLeft = e.clientX - containerRect.left - (sliderWidth / 2); // 考虑滑块宽度一半的偏移
    
    // 边界检查
    if (newLeft < 0) newLeft = 0;
    if (newLeft > maxWidth) newLeft = maxWidth;
    
    // 保存实际位置用于验证
    sliderPositionRef.current = newLeft;
    
    // 设置滑块位置和进度条百分比
    setSliderLeft(newLeft);
    setPosition((newLeft / maxWidth) * 100);
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    // 阻止页面滚动，但仍允许滑动
    e.preventDefault();
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const sliderWidth = 40; // 滑块宽度
    const trackWidth = containerRect.width; // 滑动轨道宽度
    const maxWidth = trackWidth - sliderWidth; // 最大滑动距离
    
    // 计算滑块位置，考虑触摸点位置
    let newLeft = e.touches[0].clientX - containerRect.left - (sliderWidth / 2);
    
    // 边界检查
    if (newLeft < 0) newLeft = 0;
    if (newLeft > maxWidth) newLeft = maxWidth;
    
    // 保存实际位置用于验证
    sliderPositionRef.current = newLeft;
    
    // 设置滑块位置和进度条百分比
    setSliderLeft(newLeft);
    setPosition((newLeft / maxWidth) * 100);
  }, []);
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false; // 重置拖动状态
    verifyPosition();
  };
  
  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false; // 重置拖动状态
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    verifyPosition();
  };
  
  // 验证滑块位置
  const verifyPosition = async () => {
    if (!captchaId) return;
    
    try {
      // 计算实际的x坐标值，确保使用整数
      const actualXPosition = Math.round(sliderPositionRef.current);
      
      const isSuccess = await authService.checkCaptcha(captchaId, actualXPosition, userId);
      
      if (isSuccess) {
        setIsVerified(true);
        // 验证成功后，维持当前状态，不再请求新验证码
        captchaRequestedRef.current = true;
        onSuccess(captchaId, actualXPosition); // 将验证结果传递给父组件
      } else {
        // 失败时重置
        setSliderLeft(0);
        setPosition(0);
        // 刷新验证码
        fetchCaptcha();
        if (onFail) onFail();
      }
    } catch (error) {
      console.error('验证滑块失败:', error);
      setSliderLeft(0);
      setPosition(0);
      // 刷新验证码
      fetchCaptcha();
      if (onFail) onFail();
    }
  };
  
  const resetSlider = () => {
    setIsVerified(false);
    setSliderLeft(0);
    setPosition(0);
    // 重置请求状态，允许重新请求验证码
    captchaRequestedRef.current = false;
    fetchCaptcha();
  };
  
  return (
    <div 
      className={`${styles.sliderContainer} ${loading ? styles.loading : ''}`} 
      ref={containerRef}
      style={{ height: backgroundImage ? `${bgHeight + 120}px` : '200px' }}
    >
      {!userId && (
        <div className={styles.emptyState}>
          <div>请先完成用户信息验证</div>
        </div>
      )}
      
      {userId && loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <div>加载验证码...</div>
        </div>
      )}
      
      {userId && !loading && backgroundImage && blockImage && (
        <div 
          className={styles.captchaImageContainer} 
          style={{ 
            height: `${bgHeight}px`, 
            width: `${bgWidth}px`, 
            margin: '0 auto',
            position: 'relative'
          }}
        >
          {/* 背景图片 */}
          <Image 
            className={styles.captchaBackground}
            src={backgroundImage}
            alt="验证码背景"
            width={bgWidth}
            height={bgHeight}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            draggable={false}
            priority
          />
          
          {/* 滑块图片 */}
          <Image 
            className={styles.captchaBlock}
            src={blockImage}
            alt="验证码滑块"
            width={blockWidth}
            height={blockHeight}
            style={{
              width: `${blockWidth}px`,
              height: `${blockHeight}px`,
              top: `${blockY}px`,
              left: `${sliderLeft}px`,
              position: 'absolute'
            }}
            draggable={false}
            priority
          />
        </div>
      )}
      
      {userId && (
        <div className={styles.sliderTrack}>
          <div 
            className={styles.sliderProgress} 
            style={{ width: `${position}%` }} 
          />
          
          <div 
            className={`${styles.sliderHandle} ${isVerified ? styles.success : ''}`}
            ref={sliderRef}
            style={{ left: `${sliderLeft}px` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            aria-label="滑动验证"
          >
            {isVerified ? '✓' : isDraggingRef.current ? '··':'→'}
          </div>
        </div>
      )}
      
      {userId && (
        <div className={styles.sliderText}>
          {isVerified ? '验证成功' : '请滑动滑块完成验证'}
        </div>
      )}
    </div>
  );
};

export default SliderVerify;
