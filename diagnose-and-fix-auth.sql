-- ===================================================================
-- DIAGNÓSTICO E CORREÇÃO COMPLETA - Autenticação Google OAuth
-- ===================================================================
-- Execute este script no Supabase SQL Editor para diagnosticar e corrigir
-- problemas com autenticação Google e criação de perfis
-- ===================================================================

-- ===================================================================
-- PASSO 1: DIAGNÓSTICO - Ver usuários autenticados
-- ===================================================================
SELECT
  'USUÁRIOS AUTENTICADOS' as secao,
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data->>'name' as google_name,
  u.raw_user_meta_data->>'full_name' as google_full_name,
  u.raw_user_meta_data->>'picture' as google_picture,
  u.raw_user_meta_data->>'avatar_url' as google_avatar_url
FROM auth.users u
ORDER BY u.created_at DESC;

-- ===================================================================
-- PASSO 2: DIAGNÓSTICO - Ver perfis criados
-- ===================================================================
SELECT
  'PERFIS CRIADOS' as secao,
  p.id,
  p.email,
  p.full_name,
  p.avatar_url,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;

-- ===================================================================
-- PASSO 3: DIAGNÓSTICO - Ver usuários SEM perfil
-- ===================================================================
SELECT
  'USUÁRIOS SEM PERFIL' as secao,
  u.id,
  u.email,
  u.raw_user_meta_data->>'name' as google_name,
  u.raw_user_meta_data->>'picture' as google_picture
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- ===================================================================
-- PASSO 4: CORREÇÃO - Remover trigger e função antigos
-- ===================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ===================================================================
-- PASSO 5: CORREÇÃO - Criar função melhorada
-- ===================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log para debug (você pode ver no Supabase Dashboard > Logs)
  RAISE LOG 'Novo usuário criado: % - %', NEW.id, NEW.email;
  RAISE LOG 'Meta data: %', NEW.raw_user_meta_data;

  -- Inserir ou atualizar perfil
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = timezone('utc'::text, now());

  RAISE LOG 'Perfil criado com sucesso para: %', NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'ERRO ao criar perfil: % - %', SQLERRM, SQLSTATE;
    RETURN NEW; -- Não falhar a criação do usuário
END;
$$;

-- ===================================================================
-- PASSO 6: CORREÇÃO - Criar trigger
-- ===================================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- ===================================================================
-- PASSO 7: CORREÇÃO - Adicionar política de INSERT se não existir
-- ===================================================================
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===================================================================
-- PASSO 8: CORREÇÃO - Criar perfis para usuários existentes sem perfil
-- ===================================================================
DO $$
DECLARE
  user_record RECORD;
  profile_count INTEGER;
BEGIN
  FOR user_record IN
    SELECT
      u.id,
      u.email,
      COALESCE(
        u.raw_user_meta_data->>'full_name',
        u.raw_user_meta_data->>'name',
        SPLIT_PART(u.email, '@', 1)
      ) as full_name,
      COALESCE(
        u.raw_user_meta_data->>'avatar_url',
        u.raw_user_meta_data->>'picture'
      ) as avatar_url
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
      user_record.id,
      user_record.email,
      user_record.full_name,
      user_record.avatar_url
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Perfil criado para: % (%)', user_record.email, user_record.id;
  END LOOP;

  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  RAISE NOTICE 'Total de perfis na tabela: %', profile_count;
END $$;

-- ===================================================================
-- PASSO 9: VERIFICAÇÃO FINAL - Ver todos os perfis
-- ===================================================================
SELECT
  'VERIFICAÇÃO FINAL' as secao,
  p.id,
  p.email,
  p.full_name,
  p.avatar_url,
  u.raw_user_meta_data->>'name' as google_name_original,
  u.raw_user_meta_data->>'picture' as google_picture_original
FROM public.profiles p
INNER JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;

-- ===================================================================
-- RESULTADO: Você deve ver todos os usuários com seus perfis criados
-- ===================================================================
