import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { BusinessOS } from './components/BusinessOS';
import { GeneratorCard } from './components/GeneratorCard';
import { ImageGeneratorCard } from './components/ImageGeneratorCard';
import { SystemHandover } from './components/SystemHandover';
import { SystemStatus } from './components/SystemStatus';
import { useAuth } from './contexts/AuthContext';
import { ProjectCrew } from './components/ProjectCrew';
import { Roadmap } from './components/Roadmap';
import { TestPage } from './components/TestPage';
import { AppLayout } from './components/layouts/AppLayout';
import { LoginForm } from './components/auth/LoginForm';
import { OfflineIndicator } from './components/feedback/OfflineIndicator';
import { useOffline } from './hooks/useOffline';
import { useRealTimeSync } from './hooks/useRealTimeSync';
import { api } from './services/api';
import { EnhancedContextComposer as ContextComposer } from './contexts/EnhancedContextComposer';
import { useAppState } from './contexts/AppStateContext';
import ContextDevTools from './contexts/ContextDevTools';
import { MobileApp as MobileAppView } from './MobileApp';

import {
  BASE_PROMPT,
  PRODUCT_CARDS,
  GROWTH_CARDS,
  BIZ_OPS_CARDS,
  MARKETING_CARDS,
  MOCK_INITIAL_INVENTORY,
  MOCK_INITIAL_SALES,
  MOCK_INITIAL_CUSTOMERS,
  MOCK_INITIAL_INVOICES,
  ROADMAP_DATA,
} from './constants';
import { generateGeminiContent } from './services/geminiService';
import type {
  ComposerCardData,
  GeneratorCardData,
  ScheduledPost,
  Sale,
  InventoryItem,
  Customer,
  Invoice,
  Project,
} from './types';

const PRODUCT_NAMES = ['CRNMN Signature', 'Spicy Sambal', 'Cheesy Cheeza', 'Salted Caramel'];

const getBestSeller = (sales: Sale[]): string => {
  if (sales.length === 0) return 'N/A';
  const counts = sales.reduce(
    (acc, sale) => {
      acc[sale.product] = (acc[sale.product] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

// Main authenticated app component with Advanced Context Integration
function AuthenticatedApp(): React.ReactNode {
  const { isAuthenticated } = useAuth();
  const {
    state,
    addSale,
    addCustomer,
    addProject,
    toggleTask,
    schedulePost,
    updateAIInsight,
    restockInventory,
    generateInvoice,
    metrics
  } = useAppState();

  const [useNewDesign, setUseNewDesign] = useState(false);

  // Get financial data from state directly
  const totalRevenue = state.totalRevenue;
  const cogs = state.cogs;
  const profit = state.profit;
  const fixedExpenses = state.fixedExpenses;
  const MONTHLY_GOAL = state.monthlyGoal;

  // Simulate real-time sales & inventory reduction using context
  useEffect(() => {
    const salesInterval = setInterval(() => {
      if (state.customers.length === 0) return;
      const randomProduct = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
      const randomCustomer = state.customers[Math.floor(Math.random() * state.customers.length)];

      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        product: randomProduct,
        amount: 8.9 + Math.random() * 2,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        customerId: randomCustomer.id,
      };

      addSale(newSale);
    }, 8000);

    return () => clearInterval(salesInterval);
  }, [state.customers, addSale]);

  const lastInsightTime = useRef(Date.now());

  // AI Strategic Advisor using context
  useEffect(() => {
    const now = Date.now();
    if (now - lastInsightTime.current < 60000) { // 60 seconds throttle
      return;
    }

    const generateInsight = async () => {
      lastInsightTime.current = Date.now();
      updateAIInsight('', true); // Set loading state

      const bestSeller = getBestSeller(state.sales);
      const lowStockItems = state.inventory.filter((i) => i.stock < i.threshold);

      const prompt = `
            ${BASE_PROMPT}
            You are the AI Strategic Advisor for CORNMAN.
            Analyze the following real-time business data and provide ONE concise, actionable strategic recommendation in Bahasa Melayu.
            The recommendation should be direct, insightful, and help the user achieve their goal of RM10k/month revenue.

            CURRENT DATA:
            - Total Revenue (Month-to-Date): RM${state.totalRevenue.toFixed(2)}
            - Best-selling item (based on recent sales): ${bestSeller}
            - Low Stock Items: ${lowStockItems.map((i) => `${i.name} (${i.stock} units)`).join(', ') || 'None'}

            Based on this data, what is the SINGLE MOST IMPORTANT thing I should do right now?
            Keep it short (2-3 sentences), like a real-time alert from an advisor. Start with a clear header like 'CADANGAN STRATEGIK:' or 'AMARAN OPERASI:'.
        `;
      const insight = await generateGeminiContent(prompt);
      updateAIInsight(insight, false);
    };

    generateInsight();
  }, [state.sales, state.inventory, state.totalRevenue, updateAIInsight]);

  const handleSchedule = useCallback(
    (platform: ComposerCardData['title'], content: string, icon: React.ReactNode) => {
      const newPost: ScheduledPost = {
        id: `post-${Date.now()}`,
        platform,
        icon,
        content,
        scheduledAt: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'scheduled',
      };
      schedulePost(newPost);
    },
    [schedulePost],
  );

  const handleManualRestock = useCallback((itemId: string) => {
    restockInventory(itemId, 50);
  }, [restockInventory]);

  const handleAutoRestock = useCallback(
    (itemName: string) => {
      const item = state.inventory.find(i =>
        i.name.toLowerCase().includes(itemName.toLowerCase())
      );

      if (item) {
        restockInventory(item.id, 50);
        return `Pesanan untuk 50 unit ${itemName} telah dibuat. Stok dikemaskini.`;
      }
      return `Item '${itemName}' tidak dijumpai dalam inventori.`;
    },
    [state.inventory, restockInventory],
  );

  const handleGenerateInvoice = useCallback(
    (sale: Sale) => {
      generateInvoice(sale);
    },
    [generateInvoice],
  );

  const handleAddCustomer = useCallback((name: string, phone: string) => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      lastSeen: new Date().toLocaleDateString('en-GB'),
      totalSpent: 0,
    };
    addCustomer(newCustomer);
  }, [addCustomer]);

  const handleConnectBot = useCallback(() => {
    // This would update bot connection status in context
    // For now, keeping local state
  }, []);

  const handleAddProject = useCallback((title: string) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.split('\n')[0].replace('NAMA:', '').trim(), // Extract title
      description: title,
      status: 'Perancangan',
      tasks: [
        { id: 'task1', text: 'Kaji kos bahan & harga jualan', completed: false },
        { id: 'task2', text: 'Reka pembungkusan / visual', completed: false },
        { id: 'task3', text: 'Rancang strategi pelancaran', completed: false },
        { id: 'task4', text: 'Laksanakan pelancaran', completed: false },
      ],
    };
    addProject(newProject);
  }, [addProject]);

  const handleToggleTask = useCallback((projectId: string, taskId: string) => {
    toggleTask(projectId, taskId);
  }, [toggleTask]);

  // Show new design system if toggle is enabled
  if (useNewDesign) {
    return (
      <>
        <AppLayout
          financials={{
            totalRevenue,
            cogs,
            expenses: fixedExpenses,
            profit,
            goal: MONTHLY_GOAL,
          }}
          aiInsight={state.aiInsight}
          isBriefingLoading={state.isBriefingLoading}
        />
        {/* Floating toggle button */}
        <button
          onClick={() => setUseNewDesign(false)}
          className="fixed top-4 right-4 z-50 bg-brand-electric text-dark-900 px-4 py-2 rounded-lg font-mono text-body-sm font-bold uppercase tracking-wide hover:bg-brand-electric-dark transition-all duration-200 shadow-glow-brand"
        >
          Show Old Design
        </button>
      </>
    );
  }

  return (
    <>
      {/* Toggle button for old design */}
      <button
        onClick={() => setUseNewDesign(true)}
        className="fixed top-4 right-4 z-50 bg-brand-electric text-dark-900 px-4 py-2 rounded-lg font-mono text-body-sm font-bold uppercase tracking-wide hover:bg-brand-electric-dark transition-all duration-200 shadow-glow-brand"
      >
        Show New Design
      </button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        <main className="space-y-8 sm:space-y-12 lg:space-y-16">
          <BusinessOS
            sales={state.sales}
            inventory={state.inventory}
            totalRevenue={state.totalRevenue}
            onRestock={handleManualRestock}
            aiInsight={state.aiInsight}
            isBriefingLoading={state.isBriefingLoading}
            onAutoRestock={handleAutoRestock}
            scheduledPosts={state.scheduledPosts}
            marketingCards={MARKETING_CARDS}
            onSchedulePost={handleSchedule}
            invoices={state.invoices}
            onGenerateInvoice={handleGenerateInvoice}
            customers={state.customers}
            onAddCustomer={handleAddCustomer}
            isBotConnected={state.isBotConnected}
            financials={{
              totalRevenue,
              cogs,
              expenses: fixedExpenses,
              profit,
              goal: MONTHLY_GOAL,
            }}
          />

          <Section
            title="SYSTEM HANDOVER & STATUS"
            subtitle="Command center integration and monitoring"
            titleGradient
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-grow lg:flex-[2]">
                <SystemHandover isBotConnected={state.isBotConnected} onConnect={handleConnectBot} />
              </div>
              <div className="lg:flex-[1]">
                <SystemStatus
                  isBotConnected={state.isBotConnected}
                  isBriefingLoading={state.isBriefingLoading}
                />
              </div>
            </div>
          </Section>

          <Section
            title="C.R.E.W. (Command, Research, Execution, Win)"
            subtitle="Strategic intelligence and project management suite"
            titleGradient
          >
            <div>
              <h3 className="font-heading text-heading-lg mb-6 text-dark-300 uppercase tracking-wider">
                IDEA GENERATION SUITE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {PRODUCT_CARDS.map((card) => {
                  if (card.type === 'image') {
                    return <ImageGeneratorCard key={card.id} {...card} />;
                  }
                  return (
                    <GeneratorCard
                      key={card.id}
                      {...(card as GeneratorCardData)}
                      onSaveAsProject={handleAddProject}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {GROWTH_CARDS.map((card) => (
                  <GeneratorCard key={card.id} {...card} onSaveAsProject={handleAddProject} />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {BIZ_OPS_CARDS.map((card) => (
                  <GeneratorCard key={card.id} {...card} onSaveAsProject={handleAddProject} />
                ))}
              </div>
            </div>
            <div className="mt-12">
              <ProjectCrew projects={state.projects} onToggleTask={handleToggleTask} />
            </div>
          </Section>

          <Section
            title="EMPIRE ROADMAP"
            subtitle="Strategic expansion and growth trajectory"
            titleGradient
          >
            <Roadmap data={ROADMAP_DATA} />
          </Section>
        </main>
      </div>
    </>
  );
}

// App with advanced features
function AppWithFeatures(): React.ReactNode {
  const { isAuthenticated, loading } = useAuth();

  // Initialize offline capabilities
  const { isOnline } = useOffline();

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-electric rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
            <span className="text-dark-900 font-display text-display-sm font-bold">C</span>
          </div>
          <h1 className="font-display text-heading-lg text-brand-electric mb-2">CORNMAN</h1>
          <p className="text-body-md text-dark-400 font-mono">Loading Strategic HQ...</p>
          <div className="mt-4">
            <div className="animate-spin w-6 h-6 border-2 border-brand-electric border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <OfflineIndicator />
      </>
    );
  }

  // Show main app with all features
  return (
    <>
      <AuthenticatedApp />
      <OfflineIndicator />

      {/* Real-time status in dev mode */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-50 bg-dark-800 border border-dark-600 rounded-lg p-3 font-mono text-xs space-y-1">
          <div
            className={`flex items-center gap-2 ${isOnline ? 'text-status-success' : 'text-status-error'}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-status-success' : 'bg-status-error'} animate-pulse`}
            ></div>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <div className="text-dark-300">Context System: Active</div>
        </div>
      )}
    </>
  );
}

// Main App with Mobile/Desktop Toggle
function App(): React.ReactNode {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <ContextComposer
      config={{
        enablePerformanceMonitoring: true,
        enableErrorBoundaries: true,
        errorReportingEndpoint: import.meta.env.VITE_ERROR_REPORTING_ENDPOINT,
        theme: 'dark',
        enableAutoOptimizations: true,
      }}
    >
      {/* View Mode Toggle */}
      <div className="fixed top-4 left-4 z-50 flex space-x-2">
        <button
          onClick={() => setViewMode('desktop')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'desktop'
              ? 'bg-brand-electric text-dark-900'
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
          }`}
        >
          🖥️ Desktop
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'mobile'
              ? 'bg-brand-electric text-dark-900'
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
          }`}
        >
          📱 Mobile
        </button>
      </div>

      {/* Render based on view mode */}
      {viewMode === 'mobile' ? (
        <div className="max-w-sm mx-auto bg-dark-900 min-h-screen border-x border-dark-600">
          <MobileAppView />
        </div>
      ) : (
        <AppWithFeatures />
      )}

      <ContextDevTools />
    </ContextComposer>
  );
}

export default App;