# 🔐 Configurar Google OAuth no Supabase

## ❌ Problema Atual

Quando você faz login com Google:
- ✅ O Google autentica você
- ❌ O Supabase **NÃO cria o usuário** na tabela `auth.users`
- ❌ Você consegue "entrar" mas o sistema não funciona

**Causa:** Google OAuth não está configurado corretamente no Supabase.

---

## ✅ Solução: Configurar Google OAuth

### Passo 1: Obter Credenciais do Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. No menu lateral, vá em **APIs & Services** > **Credentials**
4. Clique em **+ CREATE CREDENTIALS** > **OAuth client ID**
5. Se solicitado, configure a **OAuth consent screen**:
   - User Type: **External**
   - App name: **To-Do List App** (ou o nome que preferir)
   - User support email: **seu-email@gmail.com**
   - Developer contact: **seu-email@gmail.com**
   - Clique em **Save and Continue**
6. De volta em **Create OAuth client ID**:
   - Application type: **Web application**
   - Name: **Supabase Auth**
   - Authorized redirect URIs: (vamos adicionar no próximo passo)

### Passo 2: Obter a Callback URL do Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, vá em **Authentication** > **Providers**
4. Procure por **Google** na lista
5. Copie a **Callback URL (for OAuth)**, algo como:
   ```
   https://seu-projeto.supabase.co/auth/v1/callback
   ```

### Passo 3: Adicionar Redirect URI no Google Cloud

1. Volte para o Google Cloud Console
2. Em **Authorized redirect URIs**, clique em **+ ADD URI**
3. Cole a **Callback URL** que você copiou do Supabase
4. Clique em **CREATE**
5. **COPIE** o **Client ID** e **Client Secret** que aparecerem

### Passo 4: Configurar no Supabase

1. Volte para o Supabase Dashboard
2. Em **Authentication** > **Providers** > **Google**
3. **Habilite** o toggle "Enable Sign in with Google"
4. Cole:
   - **Client ID** (do Google Cloud Console)
   - **Client Secret** (do Google Cloud Console)
5. Em **Authorized Client IDs**, deixe vazio (ou adicione se souber)
6. Clique em **Save**

### Passo 5: Adicionar Domínio Autorizado (MUITO IMPORTANTE!)

1. No Supabase Dashboard, vá em **Authentication** > **URL Configuration**
2. Em **Redirect URLs**, adicione:
   ```
   http://localhost:5173
   http://localhost:5173/
   ```
   (Se estiver rodando em outra porta, ajuste conforme necessário)
3. Clique em **Save**

### Passo 6: Verificar Configuração do Site

1. No Supabase Dashboard, vá em **Settings** > **API**
2. Copie a **URL** do projeto (algo como `https://seu-projeto.supabase.co`)
3. Verifique se está correto no seu arquivo `.env` ou código

---

## 🧪 Testar a Configuração

### 1. Limpar Cache e Cookies

1. Pressione **Ctrl+Shift+Delete** (Chrome/Edge)
2. Selecione:
   - ✅ Cookies e outros dados de sites
   - ✅ Imagens e arquivos em cache
3. Clique em **Limpar dados**

### 2. Fazer Logout Completo

1. Faça logout do aplicativo
2. Feche TODAS as abas do navegador
3. Abra uma nova janela

### 3. Fazer Login com Google

1. Acesse o app novamente
2. Clique em "Login com Google"
3. Selecione sua conta Google
4. **Aguarde o redirecionamento**

### 4. Verificar no Console do Navegador (F12)

Você deve ver:
```
🔐 Auth state changed: SIGNED_IN
👤 Session: seu-email@gmail.com
📝 Dados do usuário do Google: {
  id: "xxx-xxx-xxx",
  email: "seu-email@gmail.com",
  user_metadata: {
    name: "Seu Nome",
    picture: "https://..."
  }
}
🔍 Buscando perfil para userId: xxx-xxx-xxx
```

### 5. Verificar no Supabase

1. Vá em **Authentication** > **Users**
2. Você deve ver seu usuário listado
3. Se aparecer, **FUNCIONOU!** 🎉

---

## 🔍 Verificar se o Usuário foi Criado no Banco

Execute no Supabase SQL Editor:

```sql
-- Ver todos os usuários autenticados
SELECT
  id,
  email,
  created_at,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'picture' as picture
FROM auth.users
ORDER BY created_at DESC;
```

**Se retornar vazio:** O Google OAuth não está configurado corretamente.
**Se retornar seu usuário:** Agora execute o script `diagnose-and-fix-auth.sql` para criar o perfil.

---

## 🐛 Problemas Comuns

### Erro: "Invalid redirect URI"

**Causa:** O redirect URI no Google Cloud não corresponde ao do Supabase.

**Solução:**
1. Verifique se copiou exatamente a Callback URL do Supabase
2. Certifique-se de que NÃO tem barra `/` no final
3. Salve novamente no Google Cloud Console

### Erro: "Redirect URI mismatch"

**Causa:** A URL de origem não está autorizada no Supabase.

**Solução:**
1. Vá em **Authentication** > **URL Configuration**
2. Adicione `http://localhost:5173` (ou sua porta)
3. Adicione também `http://localhost:5173/` (com barra)

### Login não acontece, apenas recarrega a página

**Causa:** Client ID ou Client Secret incorretos.

**Solução:**
1. Verifique se copiou corretamente do Google Cloud Console
2. Re-copie e cole novamente no Supabase
3. Salve e teste novamente

### Usuário não aparece em auth.users

**Causa 1:** Google OAuth não está habilitado.
- Verifique se o toggle está **ON** em **Authentication** > **Providers** > **Google**

**Causa 2:** Client ID/Secret inválidos.
- Crie novas credenciais no Google Cloud Console

**Causa 3:** Redirect URI incorreto.
- Verifique se está exatamente igual no Google Cloud e Supabase

---

## ✅ Checklist de Verificação

Antes de testar, verifique se TODOS estão ✅:

- [ ] Google Cloud Console: OAuth client ID criado
- [ ] Google Cloud Console: Redirect URI adicionado corretamente
- [ ] Supabase: Google provider HABILITADO
- [ ] Supabase: Client ID e Client Secret configurados
- [ ] Supabase: Redirect URLs configuradas (localhost)
- [ ] Navegador: Cache e cookies limpos
- [ ] App: Fez logout completo

---

## 📝 Após Configurar Corretamente

Quando o login funcionar:

1. ✅ Usuário será criado em `auth.users`
2. ✅ Execute `diagnose-and-fix-auth.sql` para criar o perfil
3. ✅ O sistema funcionará completamente

---

## 🆘 Se Ainda Não Funcionar

1. Tire um print da tela de configuração do Google no Supabase
2. Tire um print das credenciais no Google Cloud Console
3. Copie os logs do console do navegador (F12 > Console)
4. Verifique se há erros em vermelho

**Dica:** Use uma janela anônima para testar, assim não terá cache.
