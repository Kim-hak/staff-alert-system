<template>
  <main class="login-page">
    <section class="login-panel">
      <div>
        <p class="login-eyebrow">Staff Alert System</p>
        <h1>Sign in</h1>
      </div>

      <form class="login-form" @submit.prevent>
        <label>
          Email
          <input type="email" autocomplete="email" placeholder="name@example.com" />
        </label>

        <label>
          Password
          <input type="password" autocomplete="current-password" placeholder="Password" />
        </label>

        <button type="submit">Login</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f6f8;
  padding: 24px;
}

.login-panel {
  width: min(100%, 420px);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.login-eyebrow {
  margin: 0 0 8px;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 600;
}

h1 {
  margin: 0 0 24px;
  color: #0f172a;
  font-size: 2rem;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  color: #334155;
  font-weight: 600;
}

input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;
  font: inherit;
}

button {
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  padding: 11px 16px;
}
</style>
