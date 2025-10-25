// Script para testar conexão com Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('🔍 Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : 'não configurada')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Testar se a tabela existe
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Erro ao conectar:', error)
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('\n💡 A tabela "diary_entries" não existe!')
        console.log('Execute o SQL schema no Supabase SQL Editor')
        console.log('Veja o README.md seção "3.2. Execute o SQL Schema"')
      }
      return
    }

    console.log('✅ Conexão OK!')
    console.log(`📊 Total de entradas: ${data?.length || 0}`)
    if (data && data.length > 0) {
      console.log('📅 Primeira entrada:', data[0].date)
    }

  } catch (err) {
    console.error('❌ Erro inesperado:', err)
  }
}

testConnection()
