# 认证系统使用指南

本项目采用 Zustand 管理用户认证状态，结合 axios 拦截器实现了完整的认证流程，包括自动 token 刷新和登录状态恢复。

## 核心特性

1. **自动初始化**: 页面首次加载时自动检查本地 token 并尝试刷新
2. **状态管理**: 使用 Zustand 管理认证状态，响应式更新 UI
3. **自动刷新**: 自动处理 token 过期和刷新逻辑
4. **UI 反馈**: 加载状态下显示等待光标，提升用户体验
5. **错误处理**: 区分登录过期和服务器错误，提供适当的用户提示

## 核心组件

### 1. UserStore (store/userStore.ts)

使用 Zustand 管理用户状态：

```typescript
interface UserState {
  isLoggedIn: boolean;        // 登录状态
  isInitializing: boolean;    // 是否正在初始化
  userId: string | null;      // 用户ID
  username: string | null;    // 用户名
  
  initializeAuth: () => Promise<void>;  // 初始化认证状态
  login: (token: string, userId: string, username: string) => void;
  logout: () => void;
  updateCursorStyle: (isLoading: boolean) => void;
}
```

### 2. TokenManager (utils/tokenManager.ts)

管理 token 的存储、获取和刷新：

```typescript
export const TokenManager = {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  clearAllTokens(): void;
  hasValidToken(): boolean;
  refreshToken(): Promise<RefreshResult>;
  extractAndSaveTokenFromHeaders(headers: Record<string, any>): string | null;
  addAuthorizationHeader(headers: Record<string, string>): Record<string, string>;
}
```

### 3. AuthInitializer (components/auth/AuthInitializer.tsx)

认证初始化包装组件，在认证状态初始化完成前显示加载界面。

## 使用方法

### 1. 应用根组件设置

在 `layout.tsx` 中使用 `AuthInitializer` 包装应用：

```tsx
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { ModalProvider } from '@/modules/auth/AuthModal';

export default function RootLayout({ children }) {
  return (
    <html lang="cn">
      <body>
        <ConfigProvider>
          <AuthInitializer>
            <ModalProvider>
              <Layout>
                <HeaderNav />
                <Content>{children}</Content>
              </Layout>
            </ModalProvider>
          </AuthInitializer>
        </ConfigProvider>
      </body>
    </html>
  );
}
```

### 2. 组件中使用认证状态

```tsx
import { useAuth } from '@/hooks/useAuthInitializer';
import { useAuthModal } from '@/modules/auth/AuthModal';

function MyComponent() {
  // 获取认证状态
  const { isLoggedIn, isInitializing, userId, username } = useAuth();
  
  // 获取认证操作方法
  const { openLoginModal, openRegisterModal, logout } = useAuthModal();

  if (isInitializing) {
    return <div>认证状态初始化中...</div>;
  }

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <span>欢迎，{username}!</span>
          <button onClick={logout}>登出</button>
        </div>
      ) : (
        <div>
          <button onClick={openLoginModal}>登录</button>
          <button onClick={openRegisterModal}>注册</button>
        </div>
      )}
    </div>
  );
}
```

### 3. API 请求

API 客户端会自动处理认证：

```tsx
import { apiClient } from '@/utils/apiClient';

// 自动添加 Authorization 头
const data = await apiClient.get('/api/user/profile');

// 检查认证状态
if (apiClient.isAuthenticated()) {
  // 执行需要认证的操作
}

// 手动登出
apiClient.logout();
```

## 认证流程

### 初始化流程

1. **页面加载**: `AuthInitializer` 组件自动调用 `initializeAuth()`
2. **检查本地 token**: 从 localStorage 读取 access_token
3. **token 验证**: 
   - 如果没有 token → 设置为未登录状态
   - 如果有 token → 调用 `/api/auth/refresh` 尝试刷新
4. **刷新结果处理**:
   - 刷新成功 → 保持登录状态，更新 token
   - 刷新失败 → 清除本地 token，设置为未登录状态
5. **UI 更新**: 恢复页面 cursor 样式，完成初始化

### 登录流程

1. **用户登录**: 用户填写登录表单并提交
2. **调用登录接口**: 发送用户名/密码到 `/api/auth/login`
3. **处理登录响应**:
   - 成功 → 保存 token，更新用户状态，关闭模态框
   - 失败 → 显示错误信息
4. **自动添加认证头**: 后续请求自动携带 Authorization 头

### 自动刷新流程

1. **请求拦截**: API 请求返回 401 状态码
2. **判断请求类型**: 
   - 如果是刷新请求失败 → 直接登出
   - 如果是普通请求 → 尝试刷新 token
3. **token 刷新**: 调用 `/api/auth/refresh`
4. **刷新结果**:
   - 成功 → 更新 token，重试原始请求
   - 失败 → 清除认证信息，提示用户重新登录

## 错误处理

### 登录过期

- **场景**: `/api/auth/refresh` 返回 200，但 `data.code` 不为 200
- **处理**: 提示"登录已过期，请重新登录"，转为未登录状态

### 服务器错误

- **场景**: `/api/auth/refresh` 返回非 200 状态码
- **处理**: 提示"服务器错误"，抛出错误供上层处理

## 最佳实践

1. **状态检查**: 在需要认证的操作前检查 `isLoggedIn` 状态
2. **加载状态**: 利用 `isInitializing` 显示加载界面
3. **错误处理**: 监听认证错误，提供用户友好的反馈
4. **性能优化**: 避免不必要的认证状态检查
5. **安全考虑**: 敏感操作前再次验证用户身份

## 注意事项

- access_token 存储在 localStorage 中，刷新页面后会自动恢复
- refresh_token 存储在 httpOnly cookie 中，由浏览器自动管理
- 初始化过程中页面显示加载状态，避免闪烁问题
- 认证失败时会自动清理所有相关存储项
