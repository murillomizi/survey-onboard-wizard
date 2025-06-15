-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'mizi_ai_personalized_return';

-- Habilitar RLS se não estiver
ALTER TABLE mizi_ai_personalized_return ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir SELECT para usuários autenticados
CREATE POLICY "Permitir SELECT para usuários autenticados"
ON mizi_ai_personalized_return
FOR SELECT
TO authenticated
USING (true);

-- Verificar políticas existentes
SELECT * FROM pg_policies 
WHERE tablename = 'mizi_ai_personalized_return'; 