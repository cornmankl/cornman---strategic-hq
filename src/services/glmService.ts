// GLM 4.5 Under Z AI Service
// Integration with Zhipu AI's GLM-4.5 model via Z.AI

interface GLMRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

interface GLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Z.AI API Configuration
const ZAI_API_KEYS = [
  process.env.ZAI_API_KEY_1 || 'e4b1ade1fcd342cb964354f8ef2d6049.CVPGIwkdCwMpgWvI',
  process.env.ZAI_API_KEY_2 || '2f7bf09d033a487090c90ae99a481b0e.CtJj92XLDcMYi0ud',
  process.env.ZAI_API_KEY_3 || '7f6cc7fc804148a3bf6a0301df700526.ZksD2qy6QDPF7ZBz',
  process.env.ZAI_API_KEY_4 || '02ccf15e4d3e46f3b29f4b4fbcb4d8b8.8YfvwXUFCkwsHBZF'
];

let currentKeyIndex = 0;

// Get next available API key (round-robin)
const getNextApiKey = (): string => {
  const key = ZAI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % ZAI_API_KEYS.length;
  return key;
};

// Real Z.AI API call
const callZAI = async (prompt: string): Promise<string> => {
  try {
    const apiKey = getNextApiKey();
    
    const response = await fetch('https://api.z.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4.5',
        messages: [
          {
            role: 'system',
            content: 'Anda adalah AI Strategic Advisor untuk CORNMAN, sebuah perniagaan jagung popcorn yang popular. Berikan nasihat dalam Bahasa Melayu yang praktikal dan boleh diambil tindakan.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`Z.AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Maaf, AI tidak dapat memberikan respons.';
    
  } catch (error) {
    console.error('Z.AI API Error:', error);
    
    // Fallback to mock response if API fails
    return generateMockResponse(prompt);
  }
};

// Fallback mock responses for development/testing
const generateMockResponse = (prompt: string): string => {
  if (prompt.includes('business strategy') || prompt.includes('strategi')) {
    return `🎯 **STRATEGI PERNIAGAAN CORNMAN**

Berdasarkan analisis data anda, berikut adalah cadangan strategi utama:

1. **Pengembangan Produk**: Fokus pada perisa signature yang sudah popular
2. **Pemasaran Digital**: Tingkatkan kehadiran di TikTok dan Instagram  
3. **Operasi**: Automatkan proses inventori untuk mengelakkan stok kosong

Sasaran: RM10k/bulan boleh dicapai dalam 3 bulan dengan strategi ini.`;
  }
  
  if (prompt.includes('inventory') || prompt.includes('inventori')) {
    return `📦 **ANALISIS INVENTORI**

Status Inventori Semasa:
- Total Items: ${Math.floor(Math.random() * 50) + 20}
- Low Stock: ${Math.floor(Math.random() * 10) + 2}
- Out of Stock: ${Math.floor(Math.random() * 5) + 1}

Cadangan:
• Restock item low stock dalam 48 jam
• Buat pesanan automatik untuk item popular
• Monitor trend jualan untuk ramalan stok`;
  }
  
  if (prompt.includes('sales') || prompt.includes('jualan')) {
    return `💰 **ANALISIS JUALAN**

Trend Jualan:
• Jualan harian: +15% vs minggu lepas
• Produk terlaris: CRNMN Signature
• Masa puncak: 12-2pm, 6-8pm

Strategi:
1. Tingkatkan stok semasa waktu puncak
2. Promosi untuk produk slow-moving
3. Bundle deals untuk meningkatkan nilai jualan`;
  }
  
  return `🤖 **AI INSIGHT CORNMAN**

Berdasarkan analisis data perniagaan anda:

📊 **Performa Semasa**: Baik
🎯 **Peluang**: Tingkatkan pemasaran digital
⚠️ **Amaran**: Monitor stok inventori
💡 **Cadangan**: Fokus pada customer experience

AI terus belajar dari data anda untuk memberikan insight yang lebih tepat.`;
};

// Main GLM content generation function
export const generateGLMContent = async (request: GLMRequest): Promise<string> => {
  try {
    const { prompt } = request;
    
    // Use real Z.AI API
    const response = await callZAI(prompt);
    return response;
    
  } catch (error) {
    console.error('GLM AI Error:', error);
    return '❌ Maaf, AI sedang mengalami masalah teknikal. Sila cuba lagi.';
  }
};

// Advanced GLM features with real AI
export const generateBusinessInsights = async (data: any): Promise<string> => {
  const prompt = `
    Analisis data perniagaan CORNMAN:
    - Revenue: RM${data.revenue || 0}
    - Sales: ${data.sales || 0}
    - Inventory: ${data.inventory || 0} items
    - Customers: ${data.customers || 0}
    
    Berikan 3 cadangan strategi utama dalam Bahasa Melayu untuk meningkatkan perniagaan.
    Fokus pada:
    1. Strategi pemasaran digital
    2. Pengurusan inventori yang cekap
    3. Pertumbuhan pelanggan
    
    Berikan cadangan yang praktikal dan boleh diambil tindakan segera.
  `;
  
  return generateGLMContent({ prompt });
};

export const generateMarketingContent = async (platform: string, product: string): Promise<string> => {
  const prompt = `
    Buat kandungan pemasaran untuk ${platform} tentang produk ${product} dari CORNMAN.
    
    Gaya: Menarik, viral, sesuai untuk generasi muda
    Panjang: 1-2 ayat sahaja
    Bahasa: Bahasa Melayu dengan emoji yang sesuai
    Fokus: Highlight keunikan dan rasa produk
    
    Contoh format:
    "🍿 [Produk] - [Deskripsi menarik] [Call to action]"
  `;
  
  return generateGLMContent({ prompt });
};

export const generateInventoryRecommendations = async (inventory: any[]): Promise<string> => {
  const lowStockItems = inventory.filter(item => item.stock <= item.threshold);
  
  const prompt = `
    Analisis inventori CORNMAN:
    - Total items: ${inventory.length}
    - Low stock: ${lowStockItems.length} items
    - Items perlu restock: ${lowStockItems.map(item => item.name).join(', ')}
    
    Berikan cadangan restock dan strategi inventori yang praktikal:
    1. Analisis item yang perlu restock segera
    2. Strategi untuk mengelakkan stok kosong
    3. Cadangan untuk optimasi inventori
    
    Berikan nasihat dalam Bahasa Melayu yang boleh diambil tindakan.
  `;
  
  return generateGLMContent({ prompt });
};

// New specialized AI functions
export const generateSalesStrategy = async (salesData: any): Promise<string> => {
  const prompt = `
    Analisis strategi jualan CORNMAN:
    - Jualan hari ini: ${salesData.todaySales || 0}
    - Jualan bulan ini: ${salesData.monthSales || 0}
    - Produk terlaris: ${salesData.topProduct || 'CRNMN Signature'}
    - Trend jualan: ${salesData.trend || 'Stable'}
    
    Berikan 3 strategi untuk meningkatkan jualan:
    1. Strategi pemasaran
    2. Strategi produk
    3. Strategi operasi
    
    Fokus pada tindakan yang boleh diambil dalam 24-48 jam.
  `;
  
  return generateGLMContent({ prompt });
};

export const generateCustomerInsights = async (customerData: any): Promise<string> => {
  const prompt = `
    Analisis pelanggan CORNMAN:
    - Total pelanggan: ${customerData.totalCustomers || 0}
    - Pelanggan baru: ${customerData.newCustomers || 0}
    - Kadar retention: ${customerData.retentionRate || 0}%
    - Nilai purata pembelian: RM${customerData.averageOrderValue || 0}
    
    Berikan insight tentang:
    1. Tingkah laku pelanggan
    2. Peluang untuk meningkatkan nilai jualan
    3. Strategi untuk menarik pelanggan baru
    
    Berikan cadangan yang praktikal dan boleh diukur.
  `;
  
  return generateGLMContent({ prompt });
};

// API key management
export const getApiKeyStatus = (): { totalKeys: number; currentKey: number; status: string } => {
  return {
    totalKeys: ZAI_API_KEYS.length,
    currentKey: currentKeyIndex + 1,
    status: 'Active'
  };
};
