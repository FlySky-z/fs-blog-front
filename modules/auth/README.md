## 认证模块设计说明

### 文件结构

- `AuthContext.tsx`: 提供认证上下文和状态管理
- `useAuth.ts`: 包含认证核心逻辑和API交互
- `AuthWrapper.tsx`: 集成认证上下文和认证模态窗口
- `useAuthModalState.ts`: 管理模态窗口的UI状态
- `authApi.ts`: 认证相关的API请求封装

### 使用方式

#### 1. 在页面代码中使用认证功能

引入 `useAuthModal` hook，获取认证状态和功能：

```tsx
import { useAuthModal } from '@/modules/auth/AuthWrapper';

function MyComponent() {
  const { 
    isAuthenticated, // 是否已认证
    user,            // 用户信息
    openLoginModal,  // 打开登录模态窗口
    openRegisterModal, // 打开注册模态窗口
    handleLogout     // 登出方法
  } = useAuthModal();
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>退出登录</button>
      ) : (
        <button onClick={openLoginModal}>登录</button>
      )}
    </div>
  );
}
```

#### 2. 组件结构

1. `AuthProvider` 应在应用的根组件中使用，以确保认证状态全局可用
2. `useAuthModal` 提供了所有认证相关的方法和状态
3. 认证模态框会自动处理登录/注册逻辑和表单验证

#### 注意事项

- 认证状态使用了本地存储，刷新页面后会自动恢复
- 登录失败三次后会启用滑块验证，提高安全性
- 整个模块采用了UI和逻辑分离的设计原则
