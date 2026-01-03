# 🔧 Instruções para Corrigir Problemas de Autenticação

## 📋 Sintomas do Problema

- ❌ Não consegue adicionar membros da família
- ❌ Avatar do Google não aparece
- ❌ Erro ao tentar criar tarefas
- ❌ Console mostra: "Erro ao buscar perfil" ou "Usuário autenticado mas sem perfil"

## 🎯 Causa do Problema

O banco de dados está limpo e **não tem a tabela `profiles` criada** ou **não tem o trigger** que cria automaticamente o perfil quando você faz login com Google.

## ✅ Solução Completa

### Passo 1: Abrir o Supabase SQL Editor

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**

### Passo 2: Executar o Script de Diagnóstico e Correção

1. Abra o arquivo `diagnose-and-fix-auth.sql` deste projeto
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione Ctrl+Enter)

### Passo 3: Verificar os Resultados

O script irá:

1. ✅ Mostrar todos os usuários autenticados (da tabela `auth.users`)
2. ✅ Mostrar todos os perfis existentes (da tabela `profiles`)
3. ✅ Mostrar usuários que não têm perfil
4. ✅ Criar/Recriar a função `handle_new_user()`
5. ✅ Criar/Recriar o trigger `on_auth_user_created`
6. ✅ Criar políticas de segurança corretas
7. ✅ **CRIAR PERFIS para todos os usuários existentes que não têm perfil**
8. ✅ Mostrar verificação final com todos os perfis

### Passo 4: Verificar no Console do Navegador

1. Abra o navegador (Chrome/Edge/Firefox)
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **Console**
4. Faça logout e login novamente
5. Você deve ver mensagens assim:

```
🔐 Auth state changed: SIGNED_IN
👤 Session: seu-email@gmail.com
📝 Dados do usuário do Google: {...}
🔍 Buscando perfil para userId: xxx-xxx-xxx
✅ Perfil encontrado: {...}
```

### Passo 5: Testar

1. Após executar o script, **faça logout**
2. **Faça login novamente** com o Google
3. Tente adicionar um membro da família
4. Verifique se o avatar do Google aparece

## 🐛 Se Ainda Não Funcionar

### Verifique no Console do Navegador:

Se você ver:
```
❌ Erro ao buscar perfil: {...}
⚠️ Usuário autenticado mas sem perfil na tabela profiles
```

**Solução:**
1. Execute o script `diagnose-and-fix-auth.sql` novamente
2. Verifique se a query retorna algum usuário em "USUÁRIOS SEM PERFIL"
3. Execute manualmente o PASSO 8 do script

### Verifique as Políticas RLS:

No Supabase Dashboard:
1. Vá em **Authentication** > **Policies**
2. Certifique-se que a tabela `profiles` tem as políticas:
   - ✅ "Users can view own profile" (SELECT)
   - ✅ "Users can update own profile" (UPDATE)
   - ✅ "Users can insert own profile" (INSERT)

### Verifique a Tabela profiles:

Execute no SQL Editor:
```sql
SELECT * FROM public.profiles;
```

Deve retornar **pelo menos 1 linha** com seu usuário.

Se estiver vazia, execute:
```sql
-- Ver usuários autenticados
SELECT id, email FROM auth.users;

-- Criar perfil manualmente (substitua os valores)
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT
  id,
  email,
  raw_user_meta_data->>'name',
  raw_user_meta_data->>'picture'
FROM auth.users
WHERE email = 'SEU-EMAIL@gmail.com';
```

## 📞 Ainda com Problemas?

Se após seguir todos os passos ainda houver erros:

1. Tire um print da aba Console do navegador (F12 > Console)
2. Tire um print do resultado do script `diagnose-and-fix-auth.sql`
3. Verifique se há erros em vermelho
4. Compartilhe os prints para análise

## 🎉 Após Corrigir

Depois que tudo estiver funcionando:

- ✅ Você poderá adicionar membros da família
- ✅ O avatar do Google aparecerá corretamente
- ✅ Poderá criar tarefas normalmente
- ✅ O sistema funcionará completamente

---

**Observação:** O script `diagnose-and-fix-auth.sql` é **seguro** para executar múltiplas vezes. Ele usa `DROP IF EXISTS` e `ON CONFLICT` para evitar duplicações.
