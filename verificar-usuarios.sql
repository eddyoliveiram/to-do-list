-- ===================================================================
-- VERIFICAÇÃO RÁPIDA: Verificar se usuários estão sendo criados
-- ===================================================================
-- Execute este script DEPOIS de fazer login com Google
-- ===================================================================

-- 1. Ver se há ALGUM usuário na tabela auth.users
SELECT
  'TOTAL DE USUÁRIOS' as info,
  COUNT(*) as total
FROM auth.users;

-- 2. Ver detalhes de TODOS os usuários
SELECT
  'DETALHES DOS USUÁRIOS' as secao,
  id,
  email,
  created_at,
  last_sign_in_at,
  raw_user_meta_data->>'name' as google_name,
  raw_user_meta_data->>'picture' as google_picture,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- 3. Ver se há perfis criados
SELECT
  'TOTAL DE PERFIS' as info,
  COUNT(*) as total
FROM public.profiles;

-- 4. Ver detalhes dos perfis
SELECT
  'DETALHES DOS PERFIS' as secao,
  id,
  email,
  full_name,
  avatar_url,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- ===================================================================
-- INTERPRETAÇÃO DOS RESULTADOS:
-- ===================================================================
--
-- RESULTADO 1 (Total de usuários):
-- - Se retornar 0: Google OAuth NÃO está funcionando
-- - Se retornar 1+: Google OAuth ESTÁ funcionando
--
-- RESULTADO 2 (Detalhes dos usuários):
-- - Se vazio: Siga as instruções em CONFIGURAR-GOOGLE-OAUTH.md
-- - Se aparecer seu email: Ótimo! Agora execute diagnose-and-fix-auth.sql
--
-- RESULTADO 3 (Total de perfis):
-- - Se retornar 0 mas tem usuários: Execute diagnose-and-fix-auth.sql
-- - Se retornar mesmo total de usuários: Perfis criados com sucesso!
--
-- RESULTADO 4 (Detalhes dos perfis):
-- - Se vazio: Trigger não está funcionando, execute diagnose-and-fix-auth.sql
-- - Se aparecer: Tudo funcionando perfeitamente!
-- ===================================================================
