// Script para testar exclusão de produto via JavaScript
// Execute este script no console do navegador para testar

import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = 'SUA_URL_DO_SUPABASE'
const supabaseKey = 'SUA_CHAVE_DO_SUPABASE'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testDeletePanelaPressao() {
  console.log('🧪 TESTE - Iniciando teste de exclusão da Panela de Pressão')
  
  try {
    // 1. Encontrar a Panela de Pressão
    console.log('🔍 TESTE - Buscando Panela de Pressão...')
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, name, reservation_status')
      .eq('name', 'Panela de Pressão')
      .single()

    if (productError) {
      console.error('❌ TESTE - Erro ao buscar produto:', productError)
      return
    }

    console.log('✅ TESTE - Produto encontrado:', productData)

    // 2. Verificar métodos de compra relacionados
    console.log('🔍 TESTE - Verificando métodos de compra...')
    const { data: methodsData, error: methodsError } = await supabase
      .from('product_purchase_methods')
      .select('id, name')
      .eq('product_id', productData.id)

    if (methodsError) {
      console.warn('⚠️ TESTE - Erro ao verificar métodos:', methodsError)
    } else {
      console.log('📊 TESTE - Métodos encontrados:', methodsData?.length || 0)
    }

    // 3. Deletar métodos de compra (se existirem)
    if (methodsData && methodsData.length > 0) {
      console.log('🗑️ TESTE - Deletando métodos de compra...')
      const { error: deleteMethodsError } = await supabase
        .from('product_purchase_methods')
        .delete()
        .eq('product_id', productData.id)

      if (deleteMethodsError) {
        console.error('❌ TESTE - Erro ao deletar métodos:', deleteMethodsError)
        return
      }
      console.log('✅ TESTE - Métodos deletados com sucesso')
    }

    // 4. Verificar imagens de reserva
    console.log('🔍 TESTE - Verificando imagens de reserva...')
    const { data: imagesData, error: imagesError } = await supabase
      .from('reservation_images')
      .select('id, filename')
      .eq('product_id', productData.id)

    if (imagesError) {
      console.warn('⚠️ TESTE - Erro ao verificar imagens:', imagesError)
    } else {
      console.log('📊 TESTE - Imagens encontradas:', imagesData?.length || 0)
    }

    // 5. Deletar imagens de reserva (se existirem)
    if (imagesData && imagesData.length > 0) {
      console.log('🗑️ TESTE - Deletando imagens de reserva...')
      const { error: deleteImagesError } = await supabase
        .from('reservation_images')
        .delete()
        .eq('product_id', productData.id)

      if (deleteImagesError) {
        console.error('❌ TESTE - Erro ao deletar imagens:', deleteImagesError)
        return
      }
      console.log('✅ TESTE - Imagens deletadas com sucesso')
    }

    // 6. Tentar deletar o produto
    console.log('🗑️ TESTE - Tentando deletar produto...')
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productData.id)

    if (deleteError) {
      console.error('❌ TESTE - ERRO AO DELETAR PRODUTO:', deleteError)
      console.error('❌ TESTE - Detalhes do erro:', {
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint,
        code: deleteError.code
      })
    } else {
      console.log('✅ TESTE - Produto deletado com sucesso!')
    }

  } catch (error) {
    console.error('❌ TESTE - Erro geral:', error)
  }
}

// Executar o teste
testDeletePanelaPressao()
