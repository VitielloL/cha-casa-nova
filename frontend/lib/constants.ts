// Configurações da aplicação
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5521986189443"

export const APP_CONFIG = {
  title: "Chá de Casa Nova",
  description: "Lista de presentes para o chá de casa nova",
  whatsappNumber: WHATSAPP_NUMBER,
  appName: 'Chá de Casa Nova',
  adminEmail: 'admin@chacasanova.com'
}

// Função para buscar configurações do banco
export async function getAppConfig() {
  try {
    const { data, error } = await import('@/lib/supabase').then(m => m.supabase)
      .from('app_config')
      .select('key, value')

    if (error) throw error

    const config: Record<string, string> = {}
    data?.forEach(item => {
      config[item.key] = item.value
    })

    return config
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
    return {}
  }
}
