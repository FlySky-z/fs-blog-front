'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import styles from './slider-verify.module.scss';

interface SliderVerifyProps {
  onSuccess: () => void;
  onFail?: () => void;
}

/**
 * 滑块验证组件
 */
const SliderVerify: React.FC<SliderVerifyProps> = ({ onSuccess, onFail }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [targetPosition, setTargetPosition] = useState(0);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 随机生成目标位置
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const min = width * 0.2; // 目标在20%-70%之间
      const max = width * 0.7;
      const randomPosition = Math.floor(Math.random() * (max - min) + min);
      setTargetPosition(randomPosition);
    }
  }, []);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVerified) return;
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isVerified) return;
    setIsDragging(true);
    document.addEventListener('touchmove', handleTouchMove as any);
    document.addEventListener('touchend', handleTouchEnd as any);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    // 计算滑块位置
    let newLeft = e.clientX - containerRect.left;
    
    // 边界检查
    if (newLeft < 0) newLeft = 0;
    if (newLeft > containerWidth - 40) newLeft = containerWidth - 40;
    
    setSliderLeft(newLeft);
    setPosition((newLeft / (containerWidth - 40)) * 100);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !sliderRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    // 计算滑块位置
    let newLeft = e.touches[0].clientX - containerRect.left;
    
    // 边界检查
    if (newLeft < 0) newLeft = 0;
    if (newLeft > containerWidth - 40) newLeft = containerWidth - 40;
    
    setSliderLeft(newLeft);
    setPosition((newLeft / (containerWidth - 40)) * 100);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    verifyPosition();
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove as any);
    document.removeEventListener('touchend', handleTouchEnd as any);
    
    verifyPosition();
  };
  
  const verifyPosition = () => {
    // 验证是否拖到了正确位置（允许一定误差范围）
    const isSuccess = Math.abs(sliderLeft - targetPosition) < 10;
    
    if (isSuccess) {
      setIsVerified(true);
      onSuccess();
    } else {
      // 失败时重置
      setSliderLeft(0);
      setPosition(0);
      if (onFail) onFail();
    }
  };
  
  const resetSlider = () => {
    setIsVerified(false);
    setSliderLeft(0);
    setPosition(0);
  };
  
  return (
    <div className={styles.sliderContainer} ref={containerRef}>
      <div 
        className={styles.targetArea} 
        style={{ left: `${targetPosition}px` }}
      />
      
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
        >
          {isVerified ? '✓' : '→'}
        </div>
      </div>
      
      <div className={styles.sliderText}>
        {isVerified ? '验证成功' : '请滑动滑块完成验证'}
      </div>
      
      {isVerified && (
        <Button 
          type="link" 
          size="small" 
          onClick={resetSlider}
          className={styles.resetBtn}
        >
          重置
        </Button>
      )}
    </div>
  );
};

export default SliderVerify;
