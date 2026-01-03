-- ===================================================================
-- CRIAR MEMBRO AUTOMÁTICO PARA O DONO DA CONTA
-- ===================================================================
-- Este script cria automaticamente um membro da família quando
-- um novo usuário se cadastra via Google OAuth
-- ===================================================================

-- PASSO 1: Criar função para criar membro automático
-- ===================================================================
CREATE OR REPLACE FUNCTION public.create_owner_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar membro automático para o dono da conta
  INSERT INTO public.family_members (manager_id, name, avatar_url, color)
  VALUES (
    NEW.id,
    COALESCE(NEW.full_name, SPLIT_PART(NEW.email, '@', 1)),
    NEW.avatar_url,
    '#3b82f6' -- Cor padrão azul
  );

  RAISE LOG 'Membro criado automaticamente para: %', NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'ERRO ao criar membro automático: % - %', SQLERRM, SQLSTATE;
    RETURN NEW; -- Não falhar a criação do perfil
END;
$$;

-- PASSO 2: Criar trigger para executar após criação do perfil
-- ===================================================================
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.create_owner_member();

-- ===================================================================
-- PASSO 3: Criar membros para perfis existentes que não têm membros
-- ===================================================================
DO $$
DECLARE
  profile_record RECORD;
  member_count INTEGER;
BEGIN
  FOR profile_record IN
    SELECT
      p.id,
      p.email,
      p.full_name,
      p.avatar_url
    FROM public.profiles p
    LEFT JOIN public.family_members fm ON p.id = fm.manager_id
    WHERE fm.id IS NULL
  LOOP
    INSERT INTO public.family_members (manager_id, name, avatar_url, color)
    VALUES (
      profile_record.id,
      COALESCE(profile_record.full_name, SPLIT_PART(profile_record.email, '@', 1)),
      profile_record.avatar_url,
      '#3b82f6'
    );

    RAISE NOTICE 'Membro criado para perfil: % (%)', profile_record.email, profile_record.id;
  END LOOP;

  SELECT COUNT(*) INTO member_count FROM public.family_members;
  RAISE NOTICE 'Total de membros na tabela: %', member_count;
END $$;

-- ===================================================================
-- VERIFICAÇÃO FINAL
-- ===================================================================
SELECT
  'VERIFICAÇÃO FINAL' as secao,
  p.id as profile_id,
  p.email,
  p.full_name,
  fm.id as member_id,
  fm.name as member_name,
  fm.color as member_color,
  fm.avatar_url as member_avatar
FROM public.profiles p
LEFT JOIN public.family_members fm ON p.id = fm.manager_id
ORDER BY p.created_at DESC;

-- ===================================================================
-- RESULTADO: Cada perfil deve ter pelo menos 1 membro (ele mesmo)
-- ===================================================================
