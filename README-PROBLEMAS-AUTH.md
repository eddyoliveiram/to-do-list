# 🚨 GUIA COMPLETO: Resolver Problemas de Autenticação

## 📊 Fluxo de Autenticação Esperado

```
1. Usuário clica "Login com Google"
   ↓
2. Redirecionado para Google
   ↓
3. Escolhe conta Google
   ↓
4. Google autentica e retorna para Supabase
   ↓
5. Supabase cria usuário em auth.users ← AQUI ESTÁ FALHANDO!
   ↓
6. Trigger cria perfil em profiles
   ↓
7. App carrega perfil e permite adicionar membros
```

---

## 🔍 Diagnóstico Rápido

### Passo 1: Abrir Console do Navegador (F12)

Faça login e observe as mensagens:

#### ✅ Cenário BOM (Funcionando):
```
🔐 Auth state changed: SIGNED_IN
👤 Session: seu-email@gmail.com
📝 Dados do usuário do Google: {...}
🔍 Buscando perfil para userId: xxx-xxx-xxx
✅ Perfil encontrado: {...}
```

#### ❌ Cenário RUIM (Não Funcionando):
```
🔐 Auth state changed: SIGNED_IN
👤 Session: seu-email@gmail.com
📝 Dados do usuário do Google: {...}
🔍 Buscando perfil para userId: xxx-xxx-xxx
❌ Erro ao buscar perfil: {...}
⚠️ Usuário autenticado mas sem perfil na tabela profiles
```

### Passo 2: Verificar no Supabase

Execute o script `verificar-usuarios.sql` no SQL Editor:

```sql
SELECT COUNT(*) as total FROM auth.users;
```

#### Resultado: 0 usuários
**Problema:** Google OAuth não está configurado
**Solução:** Siga o arquivo `CONFIGURAR-GOOGLE-OAUTH.md`

#### Resultado: 1+ usuários
**Problema:** Trigger não criou o perfil
**Solução:** Execute o arquivo `diagnose-and-fix-auth.sql`

---

## 📋 Ordem de Execução dos Arquivos

### Situação 1: Nenhum Usuário em auth.users

1. ✅ Leia: `CONFIGURAR-GOOGLE-OAUTH.md`
2. ✅ Configure Google OAuth no Supabase
3. ✅ Teste login novamente
4. ✅ Execute: `verificar-usuarios.sql`
5. ✅ Se aparecer usuário, vá para Situação 2

### Situação 2: Tem Usuários mas Sem Perfis

1. ✅ Execute: `diagnose-and-fix-auth.sql`
2. ✅ Verifique se perfis foram criados
3. ✅ Faça logout e login novamente
4. ✅ Teste adicionar membros

### Situação 3: Tudo Funcionando

1. ✅ Parabéns! 🎉
2. ✅ Pode usar o app normalmente

---

## 🎯 Resumo dos Arquivos

### 1. `CONFIGURAR-GOOGLE-OAUTH.md` (LEIA PRIMEIRO!)
**Quando usar:** Quando não há usuários em `auth.users`
**O que faz:** Ensina a configurar Google OAuth no Supabase
**Resultado:** Usuários serão criados ao fazer login

### 2. `verificar-usuarios.sql` (USE PARA DIAGNÓSTICO)
**Quando usar:** Depois de fazer login
**O que faz:** Mostra se usuários e perfis existem
**Resultado:** Diagnóstico claro do problema

### 3. `diagnose-and-fix-auth.sql` (CORREÇÃO AUTOMÁTICA)
**Quando usar:** Quando há usuários mas sem perfis
**O que faz:** Cria trigger e perfis automaticamente
**Resultado:** Perfis criados para todos os usuários

### 4. `fix-google-auth-profile.sql` (OPCIONAL)
**Quando usar:** Alternativa ao arquivo 3
**O que faz:** Mesma coisa que o arquivo 3
**Resultado:** Perfis criados

### 5. `INSTRUCOES-CORRECAO-AUTH.md` (GUIA DETALHADO)
**Quando usar:** Se precisa de mais detalhes
**O que faz:** Explica passo a passo com troubleshooting
**Resultado:** Compreensão completa do processo

---

## 🚀 Passos Rápidos (TL;DR)

### Se você está com pressa:

1. **Execute:** `verificar-usuarios.sql`
2. **Se 0 usuários:** Siga `CONFIGURAR-GOOGLE-OAUTH.md`
3. **Se tem usuários:** Execute `diagnose-and-fix-auth.sql`
4. **Faça logout e login novamente**
5. **Pronto!** ✅

---

## ❓ Perguntas Frequentes

### "Por que o Google autentica mas não cria usuário?"
**R:** O Google OAuth não está configurado corretamente no Supabase. Você precisa adicionar as credenciais (Client ID e Client Secret) do Google Cloud Console.

### "Por que tem usuário mas não tem perfil?"
**R:** O trigger que cria o perfil automaticamente não existe ou falhou. Execute `diagnose-and-fix-auth.sql` para criar.

### "Por que não consigo adicionar membros?"
**R:** O código usa `user.id` que vem do perfil em `profiles`, não de `auth.users`. Se não tem perfil, `user` é null.

### "O avatar do Google não aparece"
**R:** O avatar vem do `raw_user_meta_data->>'picture'`. Se o perfil foi criado antes de corrigir o trigger, ele pode estar vazio. Execute `diagnose-and-fix-auth.sql` novamente.

---

## 🎓 Entendendo a Arquitetura

### Tabelas Importantes:

1. **`auth.users`** (Supabase Auth)
   - Criada AUTOMATICAMENTE pelo Supabase ao fazer login
   - Contém: id, email, raw_user_meta_data (com name e picture)
   - **Se vazia:** Google OAuth não está configurado

2. **`public.profiles`** (Nossa tabela)
   - Criada MANUALMENTE no schema
   - Criada pelo TRIGGER automaticamente
   - Contém: id, email, full_name, avatar_url
   - **Se vazia:** Trigger não existe ou falhou

3. **`public.family_members`** (Nossa tabela)
   - Criada MANUALMENTE no schema
   - Depende de `profiles` existir (manager_id)
   - **Se não criar:** `user.id` é null (não tem perfil)

### Fluxo de Dados:

```
Google OAuth Login
    ↓
auth.users (Supabase)
    ↓
Trigger: handle_new_user()
    ↓
public.profiles (Nossa)
    ↓
AuthContext busca profile
    ↓
useMembers usa user.id
    ↓
family_members (Nossa)
```

---

## 📞 Ainda com Problemas?

Se seguiu todos os passos e ainda não funciona:

1. Limpe o cache (Ctrl+Shift+Delete)
2. Use janela anônima
3. Verifique no Supabase Dashboard > Logs se há erros
4. Tire prints dos erros no console (F12)
5. Execute `verificar-usuarios.sql` e compartilhe o resultado

---

**Última atualização:** 2026-01-03
