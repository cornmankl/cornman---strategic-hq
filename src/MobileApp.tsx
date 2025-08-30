import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { analyticsService } from './services/analytics';
import whatsappService from './services/whatsappService';
import { MOCK_INITIAL_INVENTORY, MOCK_INITIAL_SALES, MOCK_INITIAL_CUSTOMERS } from './constants';
import { Card, CardHeader, CardContent } from './components/primitives/Card';
import { Button, AiButton, PostButton, ScheduleButton, RestockButton } from './components/UI';
import { LoadingSpinner, Skeleton } from './components/feedback/LoadingStates';
import { Badge } from './components/UI';
import { cn } from './utils/cn';

// GLM 4.5 Under Z AI Integration
import { 
  generateBusinessInsights, 
  generateMarketingContent, 
  generateInventoryRecommendations,
  generateSalesStrategy,
  generateCustomerInsights,
  getApiKeyStatus
} from './services/glmService';

// AI Status Indicator Component
const AIStatusIndicator: React.FC = () => {
  const [apiStatus, setApiStatus] = useState(getApiKeyStatus());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setApiStatus(getApiKeyStatus());
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center space-x-2">
      <Badge variant="info" className="text-xs">
        🤖 GLM 4.5 AI Active
      </Badge>
      <Badge variant="success" className="text-xs">
        🔑 Key {apiStatus.currentKey}/{apiStatus.totalKeys}
      </Badge>
      <Badge variant="success" className="text-xs">
        {apiStatus.status}
      </Badge>
    </div>
  );
};

// Mobile Navigation Component
const MobileNavigation: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'sales', icon: '💰', label: 'Sales' },
    { id: 'inventory', icon: '📦', label: 'Stock' },
    { id: 'whatsapp', icon: '📱', label: 'WhatsApp' },
    { id: 'analytics', icon: '📊', label: 'Analytics' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600 z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center p-2 rounded-lg transition-all',
              activeTab === tab.id 
                ? 'text-brand-electric bg-brand-electric/10' 
                : 'text-dark-300 hover:text-brand-electric'
            )}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Mobile Dashboard - Enhanced with GLM AI
const MobileDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await analyticsService.getRealTimeMetrics();
        setMetrics(data);
      } catch (error) {
        // Fallback to mock data
        setMetrics({
          todayRevenue: 1250,
          monthRevenue: 15000,
          todaySalesCount: 8,
          lowStockAlerts: 3
        });
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  // GLM AI Integration
  const generateAIInsight = async () => {
    setAiLoading(true);
    try {
      const insight = await generateBusinessInsights({
        revenue: metrics?.monthRevenue || 0,
        sales: metrics?.todaySalesCount || 0,
        inventory: MOCK_INITIAL_INVENTORY.length,
        customers: MOCK_INITIAL_CUSTOMERS.length
      });
      setAiInsight(insight);
    } catch (error) {
      setAiInsight('❌ Gagal mendapatkan insight AI. Sila cuba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  // Generate Sales Strategy AI
  const generateSalesStrategyAI = async () => {
    setAiLoading(true);
    try {
      const strategy = await generateSalesStrategy({
        todaySales: metrics?.todaySalesCount || 0,
        monthSales: metrics?.monthRevenue || 0,
        topProduct: 'CRNMN Signature',
        trend: 'Growing'
      });
      setAiInsight(strategy);
    } catch (error) {
      setAiInsight('❌ Gagal mendapatkan strategi jualan AI. Sila cuba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  // Generate Customer Insights AI
  const generateCustomerInsightsAI = async () => {
    setAiLoading(true);
    try {
      const insights = await generateCustomerInsights({
        totalCustomers: MOCK_INITIAL_CUSTOMERS.length,
        newCustomers: Math.floor(Math.random() * 5) + 1,
        retentionRate: 85,
        averageOrderValue: 12.50
      });
      setAiInsight(insights);
    } catch (error) {
      setAiInsight('❌ Gagal mendapatkan insight pelanggan AI. Sila cuba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton height="80px" />
        <Skeleton height="120px" />
        <Skeleton height="100px" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-brand-electric">🌽 CORNMAN</h1>
        <p className="text-dark-300">Strategic HQ Mobile</p>
        <div className="flex items-center justify-center mt-2">
          <AIStatusIndicator />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="brand" className="p-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-brand-electric">💰 Today</h3>
            <p className="text-2xl font-bold">RM {metrics?.todayRevenue || 0}</p>
            <p className="text-sm text-dark-300">{metrics?.todaySalesCount || 0} sales</p>
          </div>
        </Card>

        <Card variant="elevated" className="p-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-green-400">📈 Month</h3>
            <p className="text-2xl font-bold">RM {metrics?.monthRevenue || 0}</p>
            <p className="text-sm text-dark-300">This month</p>
          </div>
        </Card>
      </div>

      {/* AI Insights Card - Enhanced */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-brand-electric">🤖 GLM AI Insights</h3>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={generateAIInsight}
            disabled={aiLoading}
            className="text-xs"
          >
            {aiLoading ? '⏳ Loading...' : '🔄 Business'}
          </Button>
        </div>
        
        {aiInsight ? (
          <div className="p-3 bg-dark-700 rounded-lg text-sm whitespace-pre-line mb-3">
            {aiInsight}
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-dark-300 text-xs mb-3">Pilih jenis insight AI</p>
          </div>
        )}

        {/* AI Function Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={generateAIInsight}
            disabled={aiLoading}
            size="sm"
            variant="secondary"
            className="text-xs"
          >
            🏢 Business
          </Button>
          <Button 
            onClick={generateSalesStrategyAI}
            disabled={aiLoading}
            size="sm"
            variant="secondary"
            className="text-xs"
          >
            💰 Sales
          </Button>
          <Button 
            onClick={generateCustomerInsightsAI}
            disabled={aiLoading}
            size="sm"
            variant="secondary"
            className="text-xs"
          >
            👥 Customers
          </Button>
        </div>
      </Card>

      {/* Alerts */}
      {metrics?.lowStockAlerts > 0 && (
        <Card variant="default" className="p-4 bg-red-900/20 border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-red-400">⚠️ Low Stock Alert</h3>
              <p className="text-sm text-dark-300">{metrics.lowStockAlerts} items need restock</p>
            </div>
            <RestockButton>Check</RestockButton>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card variant="glass" className="p-4">
        <h3 className="font-bold mb-4">🚀 Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary" className="w-full">
            📝 New Sale
          </Button>
          <AiButton className="w-full">
            🤖 AI Insights
          </AiButton>
          <PostButton className="w-full">
            📱 Social Post
          </PostButton>
          <ScheduleButton className="w-full">
            ⏰ Schedule
          </ScheduleButton>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card variant="default" className="p-4">
        <h3 className="font-bold mb-4">📋 Recent Activity</h3>
        <div className="space-y-3">
          {MOCK_INITIAL_SALES.slice(0, 3).map((sale, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
              <div>
                <p className="font-medium">Sale #{sale.id}</p>
                <p className="text-sm text-dark-300">
                  {sale.items?.length || 1} items
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">RM {sale.total}</p>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Mobile Sales Management
const MobileSales: React.FC = () => {
  const [sales, setSales] = useState(MOCK_INITIAL_SALES);
  const [showNewSale, setShowNewSale] = useState(false);

  const totalToday = sales
    .filter(sale => new Date(sale.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">💰 Sales</h1>
        <Button onClick={() => setShowNewSale(!showNewSale)}>
          {showNewSale ? 'Cancel' : '+ New Sale'}
        </Button>
      </div>

      {/* Today's Summary */}
      <Card variant="brand" className="p-4">
        <h3 className="font-bold text-brand-electric mb-2">Today's Sales</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">RM {totalToday}</p>
            <p className="text-sm text-dark-300">{sales.length} transactions</p>
          </div>
          <div className="text-right">
            <Badge variant="success">+12%</Badge>
            <p className="text-xs text-dark-300">vs yesterday</p>
          </div>
        </div>
      </Card>

      {/* New Sale Form */}
      {showNewSale && (
        <Card variant="elevated" className="p-4">
          <h3 className="font-bold mb-4">📝 New Sale</h3>
          <div className="space-y-3">
            <select className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg">
              <option>Select Product</option>
              {MOCK_INITIAL_INVENTORY.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - RM {item.price}
                </option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Quantity" 
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg"
            />
            <input 
              type="text" 
              placeholder="Customer Name" 
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg"
            />
            <Button variant="primary" className="w-full">
              💾 Save Sale
            </Button>
          </div>
        </Card>
      )}

      {/* Sales List */}
      <div className="space-y-3">
        {sales.map((sale) => (
          <Card key={sale.id} variant="default" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Sale #{sale.id}</p>
                <p className="text-sm text-dark-300">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-dark-400">
                  Customer: {sale.customerId}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">RM {sale.total}</p>
                <Badge variant={sale.status === 'completed' ? 'success' : 'warning'}>
                  {sale.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Mobile Inventory Management - Enhanced with GLM AI
const MobileInventory: React.FC = () => {
  const [inventory, setInventory] = useState(MOCK_INITIAL_INVENTORY);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  const filteredInventory = inventory.filter(item => {
    if (filter === 'low') return item.stock <= item.threshold && item.stock > 0;
    if (filter === 'out') return item.stock === 0;
    return true;
  });

  const lowStockCount = inventory.filter(item => item.stock <= item.threshold && item.stock > 0).length;
  const outOfStockCount = inventory.filter(item => item.stock === 0).length;

  // GLM AI Integration for Inventory
  const generateInventoryAI = async () => {
    setAiLoading(true);
    try {
      const recommendation = await generateInventoryRecommendations(inventory);
      setAiRecommendation(recommendation);
    } catch (error) {
      setAiRecommendation('❌ Gagal mendapatkan cadangan AI. Sila cuba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📦 Inventory</h1>
        <RestockButton>+ Add Item</RestockButton>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="default" className="p-3 text-center">
          <p className="text-lg font-bold">{inventory.length}</p>
          <p className="text-xs text-dark-300">Total Items</p>
        </Card>
        <Card variant="default" className="p-3 text-center bg-yellow-900/20 border-yellow-500/30">
          <p className="text-lg font-bold text-yellow-400">{lowStockCount}</p>
          <p className="text-xs text-dark-300">Low Stock</p>
        </Card>
        <Card variant="default" className="p-3 text-center bg-red-900/20 border-red-500/30">
          <p className="text-lg font-bold text-red-400">{outOfStockCount}</p>
          <p className="text-xs text-dark-300">Out of Stock</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All', count: inventory.length },
          { key: 'low', label: 'Low Stock', count: lowStockCount },
          { key: 'out', label: 'Out of Stock', count: outOfStockCount }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === tab.key
                ? 'bg-brand-electric text-dark-900'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* AI Inventory Recommendations */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-brand-electric">🤖 AI Cadangan Inventori</h3>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={generateInventoryAI}
            disabled={aiLoading}
            className="text-xs"
          >
            {aiLoading ? '⏳ Loading...' : '🔄 Dapatkan Cadangan'}
          </Button>
        </div>
        
        {aiRecommendation ? (
          <div className="p-3 bg-dark-700 rounded-lg text-sm whitespace-pre-line">
            {aiRecommendation}
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-dark-300 text-xs">Klik butang untuk dapatkan cadangan AI</p>
          </div>
        )}
      </Card>

      {/* Inventory List */}
      <div className="space-y-3">
        {filteredInventory.map((item) => {
          const isLowStock = item.stock <= item.threshold && item.stock > 0;
          const isOutOfStock = item.stock === 0;
          
          return (
            <Card 
              key={item.id} 
              variant="default" 
              className={cn(
                'p-4',
                isOutOfStock && 'bg-red-900/20 border-red-500/30',
                isLowStock && 'bg-yellow-900/20 border-yellow-500/30'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-dark-300">Category: {item.category}</p>
                  <p className="text-sm text-dark-300">Supplier: {item.supplier}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-dark-700 px-2 py-1 rounded">
                      Cost: RM {item.cost}
                    </span>
                    <span className="text-xs bg-dark-700 px-2 py-1 rounded">
                      Price: RM {item.price}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'text-2xl font-bold',
                    isOutOfStock && 'text-red-400',
                    isLowStock && 'text-yellow-400'
                  )}>
                    {item.stock}
                  </p>
                  <p className="text-xs text-dark-400">Threshold: {item.threshold}</p>
                  {(isLowStock || isOutOfStock) && (
                    <RestockButton className="mt-2 text-xs">
                      Restock
                    </RestockButton>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Mobile WhatsApp Interface - Enhanced with GLM AI
const MobileWhatsApp: React.FC = () => {
  const [botStatus, setBotStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [messageQueue, setMessageQueue] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState({ to: '', body: '' });
  const [botMessage, setBotMessage] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const status = whatsappService.getStatus();
    setMessageQueue(whatsappService.getMessageQueue());
    
    // Check if bot is already connected
    if (whatsappService.getConnectionStatus()) {
      setBotStatus('connected');
    }

    // Listen for connection changes
    whatsappService.onConnectionChange((status) => {
      setBotStatus(status ? 'connected' : 'disconnected');
      if (status) {
        setQrCode(null); // Clear QR code when connected
        setBotMessage('✅ REAL WhatsApp Bot Connected!');
      }
    });
  }, []);

    const handleStartBot = async () => {
    if (isStarting) return;
    
    setIsStarting(true);
    setBotStatus('connecting');
    setBotMessage('🚀 Starting REAL WhatsApp Bot...');
    setQrCode(null);
    
    try {
      // Start the bot server first
      try {
        await fetch('http://localhost:4001/start', { method: 'POST' });
        setBotMessage('🤖 Bot server started! Getting QR code...');
      } catch (e) {
        console.log('Bot server already running or failed to start');
      }
      
      // Poll for QR code from real server
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds
      
      const pollForQR = async () => {
        try {
          const response = await fetch('http://localhost:4001/qr');
          if (response.ok) {
            const data = await response.json();
            if (data.qrCode) {
              setQrCode(data.qrCode);
              setBotStatus('disconnected'); // Waiting for scan
              setBotMessage('📱 REAL QR CODE READY! Scan dengan WhatsApp untuk connect!');
              return true;
            }
          }
        } catch (error) {
          console.log('QR fetch attempt failed:', error);
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollForQR, 1000); // Try again in 1 second
        } else {
          setBotMessage('❌ Failed to get QR code. Check if bot server is running.');
          setBotStatus('disconnected');
        }
      };
      
      // Start polling after 2 seconds
      setTimeout(pollForQR, 2000);
      
    } catch (error) {
      setBotStatus('disconnected');
      setBotMessage('❌ Error starting bot server.');
      console.error('Error:', error);
    } finally {
      setIsStarting(false);
    }
  };

  // GLM AI Integration for Marketing Content
  const generateMarketingAI = async (platform: string = 'WhatsApp', product: string = 'CRNMN Signature') => {
    setAiLoading(true);
    try {
      const content = await generateMarketingContent(platform, product);
      setAiGeneratedContent(content);
      setNewMessage(prev => ({ ...prev, body: content }));
    } catch (error) {
      setAiGeneratedContent('❌ Gagal menjana kandungan AI. Sila cuba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.to && newMessage.body) {
      await whatsappService.sendMessage({
        to: newMessage.to,
        from: '+60123456789',
        body: newMessage.body
      });
      setNewMessage({ to: '', body: '' });
      setMessageQueue(whatsappService.getMessageQueue());
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📱 WhatsApp</h1>
        <Badge variant={botStatus === 'connected' ? 'success' : 'warning'}>
          {botStatus}
        </Badge>
      </div>

      {/* REAL Bot Control */}
      <Card variant="brand" className="p-4">
        <h3 className="font-bold mb-4">🤖 REAL WhatsApp Bot Control</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status: {botStatus}</p>
              <p className="text-sm text-dark-300">Queue: {messageQueue.length} messages</p>
            </div>
            <Badge variant={botStatus === 'connected' ? 'success' : botStatus === 'connecting' ? 'warning' : 'error'}>
              {botStatus}
            </Badge>
          </div>
          
          {botMessage && (
            <div className="p-3 bg-dark-700 rounded-lg text-sm">
              {botMessage}
            </div>
          )}

          {/* QR Code Display */}
          {qrCode && (
            <Card variant="elevated" className="p-4">
              <div className="text-center">
                <h4 className="font-bold mb-3 text-brand-electric">📱 WHATSAPP BOT SETUP</h4>
                <p className="text-sm text-dark-300 mb-4">
                  Connect to the WhatsApp Command Center.<br/>
                  Scan the QR code with your phone to link the bot.
                </p>
                <div className="bg-white p-4 rounded-lg w-full overflow-x-auto">
                  <pre className="text-sm font-mono text-black whitespace-pre text-center leading-tight">{qrCode}</pre>
                </div>
                <div className="mt-4 p-3 bg-dark-700 rounded-lg">
                  <p className="text-xs text-dark-300">
                    📱 <strong>How to scan:</strong><br/>
                    1. Open WhatsApp on your phone<br/>
                    2. Go to Settings → Linked Devices<br/>
                    3. Tap "Link a Device"<br/>
                    4. Scan the QR code above
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          <div className="flex space-x-2">
            {botStatus === 'disconnected' && (
              <Button 
                onClick={handleStartBot}
                disabled={isStarting}
                className="flex-1"
              >
                {isStarting ? '⏳ Starting...' : '🚀 Start REAL Bot'}
              </Button>
            )}
            {botStatus === 'connected' && (
              <Button 
                onClick={() => {
                  whatsappService.disconnect();
                  setBotStatus('disconnected');
                  setBotMessage('Bot stopped');
                }}
                variant="secondary"
                className="flex-1"
              >
                🛑 Stop Bot
              </Button>
            )}
            {botStatus === 'connecting' && (
              <div className="flex-1 p-2 text-center text-sm text-brand-electric">
                ⏳ Connecting... Check terminal for QR code
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Send Message */}
      <Card variant="elevated" className="p-4">
        <h3 className="font-bold mb-4">📤 Send Message</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Phone number (+60123456789)"
            value={newMessage.to}
            onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
            className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg"
          />
          <textarea
            placeholder="Message content"
            value={newMessage.body}
            onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
            className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg h-24 resize-none"
          />
          <Button 
            onClick={handleSendMessage} 
            className="w-full"
            disabled={botStatus !== 'connected'}
          >
            {botStatus === 'connected' ? '📤 Send REAL WhatsApp' : '📤 Connect Bot First'}
          </Button>
        </div>
      </Card>

      {/* GLM AI Content Generator */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-brand-electric">🤖 GLM AI Content Generator</h3>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => generateMarketingAI('WhatsApp', 'CRNMN Signature')}
            disabled={aiLoading}
            className="text-xs"
          >
            {aiLoading ? '⏳ Loading...' : '🔄 Generate AI'}
          </Button>
        </div>
        
        {aiGeneratedContent ? (
          <div className="p-3 bg-dark-700 rounded-lg text-sm whitespace-pre-line mb-3">
            {aiGeneratedContent}
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-dark-300 text-xs">Klik butang untuk menjana kandungan AI</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => generateMarketingAI('WhatsApp', 'CRNMN Signature')}
            disabled={aiLoading}
            size="sm"
            variant="secondary"
          >
            🍿 CRNMN Signature
          </Button>
          <Button 
            onClick={() => generateMarketingAI('WhatsApp', 'Spicy Sambal')}
            disabled={aiLoading}
            size="sm"
            variant="secondary"
          >
            🌶️ Spicy Sambal
          </Button>
        </div>
      </Card>

      {/* Message Templates */}
      <Card variant="default" className="p-4">
        <h3 className="font-bold mb-4">📋 Quick Templates</h3>
        <div className="space-y-2">
          {[
            { title: 'Order Ready', template: 'Your order is ready for pickup! 🛍️' },
            { title: 'Payment Reminder', template: 'Friendly reminder: Your payment is due today.' },
            { title: 'Thank You', template: 'Thank you for your order! We appreciate your business 🙏' }
          ].map((temp, index) => (
            <button
              key={index}
              onClick={() => setNewMessage({ ...newMessage, body: temp.template })}
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-left hover:bg-dark-600 transition-colors"
            >
              <p className="font-medium">{temp.title}</p>
              <p className="text-sm text-dark-300">{temp.template}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Message Queue */}
      {messageQueue.length > 0 && (
        <Card variant="default" className="p-4">
          <h3 className="font-bold mb-4">📬 Message Queue</h3>
          <div className="space-y-2">
            {messageQueue.slice(0, 5).map((msg, index) => (
              <div key={index} className="p-3 bg-dark-700 rounded-lg">
                <p className="font-medium">To: {msg.to}</p>
                <p className="text-sm text-dark-300">{msg.body}</p>
                <Badge variant="warning" className="mt-1">Pending</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// Mobile Analytics Dashboard - Enhanced with GLM AI
const MobileAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [revenue, sales, inventory, customer] = await Promise.all([
          analyticsService.getRevenueAnalytics(),
          analyticsService.getSalesAnalytics(),
          analyticsService.getInventoryAnalytics(),
          analyticsService.getCustomerAnalytics()
        ]);
        setAnalytics({ revenue, sales, inventory, customer });
      } catch (error) {
        // Fallback to mock analytics
        setAnalytics({
          revenue: { totalRevenue: 45000, monthlyRevenue: 15000, revenueGrowth: 12.5 },
          sales: { totalSales: 156, monthlySales: 48, salesGrowth: 8.2 },
          inventory: { totalItems: 25, lowStockItems: 3, outOfStockItems: 1 },
          customer: { totalCustomers: 89, newCustomers: 12, churnRate: 5.2 }
        });
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  // GLM AI Integration for Analytics
  const generateAnalyticsAI = async () => {
    setAiLoading(true);
    try {
      const insight = await generateBusinessInsights({
        revenue: analytics?.revenue?.totalRevenue || 0,
        sales: analytics?.sales?.totalSales || 0,
        inventory: analytics?.inventory?.totalItems || 0,
        customers: analytics?.customer?.totalCustomers || 0
      });
      setAiInsight(insight);
    } catch (error) {
      setAiInsight('❌ Gagal mendapatkan insight AI. Sila cuba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <Skeleton height="60px" />
        <Skeleton height="120px" />
        <Skeleton height="80px" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">📊 Analytics</h1>

      {/* Revenue Overview */}
      <Card variant="brand" className="p-4">
        <h3 className="font-bold text-brand-electric mb-4">💰 Revenue Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">RM {analytics?.revenue?.totalRevenue || 0}</p>
            <p className="text-sm text-dark-300">Total Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-bold">RM {analytics?.revenue?.monthlyRevenue || 0}</p>
            <p className="text-sm text-dark-300">This Month</p>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <Badge variant={analytics?.revenue?.revenueGrowth > 0 ? 'success' : 'error'}>
            {analytics?.revenue?.revenueGrowth > 0 ? '+' : ''}{analytics?.revenue?.revenueGrowth || 0}%
          </Badge>
          <span className="ml-2 text-sm text-dark-300">vs last month</span>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="elevated" className="p-4 text-center">
          <h4 className="font-bold text-green-400">📈 Sales</h4>
          <p className="text-xl font-bold">{analytics?.sales?.totalSales || 0}</p>
          <p className="text-sm text-dark-300">Total Orders</p>
          <Badge variant="success" className="mt-2">
            +{analytics?.sales?.salesGrowth || 0}%
          </Badge>
        </Card>

        <Card variant="elevated" className="p-4 text-center">
          <h4 className="font-bold text-blue-400">👥 Customers</h4>
          <p className="text-xl font-bold">{analytics?.customer?.totalCustomers || 0}</p>
          <p className="text-sm text-dark-300">Total Customers</p>
          <Badge variant="info" className="mt-2">
            {analytics?.customer?.newCustomers || 0} new
          </Badge>
        </Card>
      </div>

      {/* Inventory Status */}
      <Card variant="default" className="p-4">
        <h3 className="font-bold mb-4">📦 Inventory Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Total Items</span>
            <Badge variant="info">{analytics?.inventory?.totalItems || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Low Stock</span>
            <Badge variant="warning">{analytics?.inventory?.lowStockItems || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Out of Stock</span>
            <Badge variant="error">{analytics?.inventory?.outOfStockItems || 0}</Badge>
          </div>
        </div>
      </Card>

      {/* AI Insights - Enhanced with GLM */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-electric">🤖 GLM AI Insights</h3>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={generateAnalyticsAI}
            disabled={aiLoading}
            className="text-xs"
          >
            {aiLoading ? '⏳ Loading...' : '🔄 Refresh AI'}
          </Button>
        </div>
        
        {aiInsight ? (
          <div className="space-y-3">
            <div className="p-3 bg-dark-700 rounded-lg text-sm whitespace-pre-line">
              {aiInsight}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-dark-700 rounded-lg">
              <p className="text-sm">📈 Your revenue growth is {analytics?.revenue?.revenueGrowth || 0}% this month. Consider increasing marketing efforts!</p>
            </div>
            <div className="p-3 bg-dark-700 rounded-lg">
              <p className="text-sm">⚠️ {analytics?.inventory?.lowStockItems || 0} items are running low. Plan your next restock order.</p>
            </div>
            <div className="p-3 bg-dark-700 rounded-lg">
              <p className="text-sm">🎯 Customer acquisition is strong with {analytics?.customer?.newCustomers || 0} new customers this month!</p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={generateAnalyticsAI}
          disabled={aiLoading}
          className="w-full mt-4"
          variant="primary"
        >
          {aiLoading ? '⏳ AI sedang berfikir...' : '🤖 Dapatkan Insight GLM AI'}
        </Button>
      </Card>
    </div>
  );
};

// Main Mobile App Component
export const MobileApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900 p-4">
        <Card variant="brand" className="p-6 w-full max-w-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-electric mb-4">🌽 CORNMAN</h1>
            <p className="text-dark-300 mb-6">Strategic HQ Mobile</p>
            <Button className="w-full">Login to Continue</Button>
          </div>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'sales':
        return <MobileSales />;
      case 'inventory':
        return <MobileInventory />;
      case 'whatsapp':
        return <MobileWhatsApp />;
      case 'analytics':
        return <MobileAnalytics />;
      default:
        return <MobileDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Status Bar */}
      <div className="bg-dark-800 p-2 text-center text-sm">
        <span className="text-brand-electric">●</span> CORNMAN Mobile • {user.businessName || 'Demo Mode'}
        <div className="flex items-center justify-center mt-1">
          <AIStatusIndicator />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileApp;
