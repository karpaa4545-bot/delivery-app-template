"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, LayoutDashboard, Utensils, Settings, LogOut, ChevronRight, Upload, ImageIcon, X, Images, ShoppingCart, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, Category, StoreConfig } from '@/lib/data';
import { BRANDING } from '@/lib/branding';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'config' | 'banners' | 'orders'>('orders');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [activeAdminCategory, setActiveAdminCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [lockError, setLockError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // SENHA DEFINIDA AQUI: "KARPA4545"
        if (passwordInput === "KARPA4545") {
            setIsAuthenticated(true);
        } else {
            setLockError(true);
            setTimeout(() => setLockError(false), 2000);
        }
    };

    const fetchOrders = () => {
        setLoading(true);
        fetch('/api/data')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateCategory = (id: string, name: string) => {
        setData((prev: any) => ({
            ...prev,
            categories: prev.categories.map((c: Category) => c.id === id ? { ...c, name } : c)
        }));
    };

    const addCategory = () => {
        const newCat: Category = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Nova Categoria",
            icon: "Utensils"
        };
        setData((prev: any) => ({ ...prev, categories: [...prev.categories, newCat] }));
    };

    const deleteCategory = (id: string) => {
        if (confirm("Tem certeza? Isso pode afetar os produtos vinculados a esta categoria.")) {
            setData((prev: any) => ({
                ...prev,
                categories: prev.categories.filter((c: Category) => c.id !== id)
            }));
        }
    };

    const handleImageUpload = async (file: File, path: string, callback: (url: string) => void) => {
        const formData = new FormData();
        formData.append('file', file);

        setUploading(path);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Falha no upload');
            }

            const result = await res.json();
            callback(result.url);
        } catch (error: any) {
            alert(`Aviso: ${error.message}\n\nDica: Copie o link da imagem e cole direto no campo de texto.`);
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async (customData?: any) => {
        setSaving(true);
        try {
            const res = await fetch('/api/data', {
                method: 'POST',
                body: JSON.stringify(customData || data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                alert("Alterações salvas com sucesso!");
            } else {
                const errorData = await res.json().catch(() => ({ message: res.statusText }));
                alert(`Erro ao salvar: ${errorData.message || "Erro desconhecido"}`);
            }
        } catch (error: any) {
            console.error("Save error:", error);
            alert(`Erro de conexão: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const updateProduct = (id: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            products: prev.products.map((p: Product) => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const addProduct = () => {
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Novo Produto",
            description: "Descrição aqui",
            price: 0,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
            category: activeAdminCategory === "all" ? data.categories[0].id : activeAdminCategory,
            available: true
        };
        setData((prev: any) => ({ ...prev, products: [...prev.products, newProduct] }));
    };

    const deleteProduct = (id: string) => {
        if (confirm("Tem certeza que deseja excluir?")) {
            setData((prev: any) => ({
                ...prev,
                products: prev.products.filter((p: Product) => p.id !== id)
            }));
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <form onSubmit={handleLogin} className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Utensils className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="font-bold text-2xl text-slate-800">Painel do Restaurante</h1>
                        <p className="text-slate-500 text-sm">Digite sua senha para acessar</p>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="password"
                            autoFocus
                            placeholder="Senha de acesso"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className={cn(
                                "w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold text-center text-lg outline-none transition-all placeholder:font-normal",
                                lockError ? "border-red-500 bg-red-50 text-red-500 animate-shake" : "border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10"
                            )}
                        />
                        {lockError && <p className="text-xs text-center text-red-500 font-bold">Senha incorreta</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-8 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black">AD</div>
                    <h1 className="font-black text-xl tracking-tight uppercase">Painel App</h1>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group",
                            activeTab === 'orders' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Pedidos
                        <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'orders' ? "rotate-90" : "")} />
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group",
                            activeTab === 'products' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <Utensils className="w-5 h-5" />
                        Cardápio
                        <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'products' ? "rotate-90" : "")} />
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group",
                            activeTab === 'categories' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Categorias
                        <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'categories' ? "rotate-90" : "")} />
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group",
                            activeTab === 'config' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <Settings className="w-5 h-5" />
                        Configurações
                        <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'config' ? "rotate-90" : "")} />
                    </button>
                    <button
                        onClick={() => setActiveTab('banners')}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group",
                            activeTab === 'banners' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <Images className="w-5 h-5" />
                        Banners
                        <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'banners' ? "rotate-90" : "")} />
                    </button>
                </nav>

                <button className="flex items-center gap-3 p-4 rounded-2xl opacity-40 hover:opacity-100 hover:bg-red-500/10 text-red-400 font-bold transition-all">
                    <LogOut className="w-5 h-5" /> Sair
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                            {activeTab === 'orders' ? 'Pedidos Recebidos' : activeTab === 'products' ? 'Gerenciar Cardápio' : activeTab === 'categories' ? 'Gerenciar Categorias' : activeTab === 'banners' ? 'Gerenciar Banners' : 'Configurações da Loja'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-muted-foreground">Administre sua loja em tempo real.</p>
                            {activeTab === 'orders' && (
                                <button onClick={fetchOrders} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold hover:bg-primary/20 transition-all uppercase">
                                    🔄 Atualizar Lista
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-green-600/20 flex items-center justify-center gap-3 font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
                        SALVAR ALTERAÇÕES
                    </button>
                </header>

                {/* EDIÇÃO RÁPIDA DO NOME - LOGO NO TOPO */}
                <div className="mb-8 bg-primary/5 p-6 rounded-[2.5rem] border-2 border-primary/20">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <label className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Nome do Aplicativo / Restaurante</label>
                        <button
                            onClick={() => {
                                if (confirm("Restaurar nome padrão do sistema?")) {
                                    setData({ ...data, store: { ...data.store, name: BRANDING.name } });
                                }
                            }}
                            className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            Resetar para o Código
                        </button>
                    </div>
                    <input
                        value={data.store.name}
                        onChange={(e) => setData({ ...data, store: { ...data.store, name: e.target.value } })}
                        className="w-full bg-white border-none rounded-3xl p-5 font-black text-2xl text-slate-800 shadow-sm focus:ring-4 focus:ring-primary/20 outline-none"
                        placeholder="Escreva o nome aqui..."
                    />
                </div>

                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        {(!data.orders || data.orders.length === 0) ? (
                            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold">Nenhum pedido recebido ainda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {data.orders.map((order: any) => (
                                    <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                                        <div className="space-y-1 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-slate-100 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider text-slate-500">#{order.id}</span>
                                                <span className="text-xs text-slate-400">{order.date}</span>
                                            </div>
                                            <div className="font-black text-slate-800 text-lg">
                                                {order.items.length} itens - R$ {order.total.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-slate-500 font-medium">
                                                Pagamento: <span className="text-primary font-bold uppercase">{order.payment}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setTimeout(() => window.print(), 100);
                                                }}
                                                className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
                                            >
                                                <Save className="w-3 h-3" /> Imprimir
                                            </button>

                                            {/* Seletor de Status */}
                                            <select
                                                value={order.status || 'Pendente'}
                                                onChange={(e) => {
                                                    const newStatus = e.target.value;
                                                    const newOrders = data.orders.map((o: any) =>
                                                        o.id === order.id ? { ...o, status: newStatus } : o
                                                    );
                                                    const newData = { ...data, orders: newOrders };
                                                    setData(newData);
                                                    handleSave(newData);

                                                    // Se o status for "Saindo para Entrega", avisa no Zap
                                                    if (newStatus === 'Saindo para Entrega') {
                                                        const msg = encodeURIComponent(`*Olá! Seu pedido do ${data.store.name} está saindo para entrega agora!* 🛵🍔`);
                                                        window.open(`https://wa.me/${data.store.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
                                                    }
                                                }}
                                                className={cn(
                                                    "text-[10px] font-bold px-3 py-2 rounded-xl border-none ring-1 ring-slate-200 focus:ring-primary/20",
                                                    order.status === 'Pronto' ? "bg-green-50 text-green-600" :
                                                        order.status === 'Saindo para Entrega' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                                                )}
                                            >
                                                <option value="Pendente">⏳ Pendente</option>
                                                <option value="Preparando">🔥 Preparando</option>
                                                <option value="Saindo para Entrega">🛵 Saiu para Entrega</option>
                                                <option value="Pronto">✅ Entregue</option>
                                            </select>

                                            {/* Botão de Avaliação */}
                                            {order.status === 'Pronto' && data.store.reviewLink && (
                                                <button
                                                    onClick={() => {
                                                        const msg = encodeURIComponent(`*Oi! Esperamos que tenha gostado do seu pedido!* 😍\n\nSe puder nos avaliar no Google, ajuda muito o nosso trabalho: \n${data.store.reviewLink}`);
                                                        window.open(`https://wa.me/${data.store.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
                                                    }}
                                                    className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-200 transition-all"
                                                >
                                                    ⭐ Pedir Avaliação
                                                </button>
                                            )}

                                            <button
                                                onClick={() => {
                                                    if (confirm("Deseja excluir este pedido? Para sua segurança, ele será apagado permanentemente após a confirmação.")) {
                                                        const newOrders = data.orders.filter((o: any) => o.id !== order.id);
                                                        const newData = { ...data, orders: newOrders };
                                                        setData(newData);
                                                        handleSave(newData);
                                                    }
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Layout Oculto para Impressora Térmica */}
                {selectedOrder && (
                    <div id="printable-receipt" className="hidden print:block text-left">
                        <div className="text-center font-bold border-b-2 border-dashed border-black pb-2 mb-2">
                            <h3 className="uppercase">{data.store.name}</h3>
                            <p className="text-[10px] font-normal">{data.store.address}</p>
                            <p className="text-[10px] font-normal">{selectedOrder.date}</p>
                        </div>

                        <div className="space-y-1 mb-2">
                            <p className="font-bold border-b border-black">ITENS DO PEDIDO</p>
                            {selectedOrder.items.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between text-[11px]">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-dashed border-black pt-2 space-y-1 text-[11px]">
                            <p className="flex justify-between font-black text-[13px]">
                                <span>TOTAL:</span>
                                <span>R$ {selectedOrder.total.toFixed(2)}</span>
                            </p>
                            <p><strong>PAGAMENTO:</strong> {selectedOrder.payment}</p>
                            {selectedOrder.observation && (
                                <p><strong>OBS:</strong> {selectedOrder.observation}</p>
                            )}
                            {selectedOrder.location && (
                                <p className="text-[10px]"><strong>GPS:</strong> {selectedOrder.location.lat}, {selectedOrder.location.lng}</p>
                            )}
                        </div>

                        <div className="text-center mt-4 pt-4 border-t border-black">
                            <p className="text-[10px]">Agradecemos sua preferência!</p>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6">
                        {/* Category Selector for Admin */}
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveAdminCategory("all")}
                                className={cn(
                                    "px-6 py-2 rounded-xl font-bold text-sm transition-all",
                                    activeAdminCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-50 text-slate-500"
                                )}
                            >
                                TODOS
                            </button>
                            {data.categories.map((cat: Category) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveAdminCategory(cat.id)}
                                    className={cn(
                                        "px-6 py-2 rounded-xl font-bold text-sm transition-all uppercase",
                                        activeAdminCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-50 text-slate-500"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={addProduct}
                            className="w-full border-2 border-dashed border-primary/30 text-primary p-6 rounded-[2.5rem] hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
                        >
                            <Plus className="w-6 h-6" /> Adicionar em {activeAdminCategory === "all" ? "Geral" : data.categories.find((c: any) => c.id === activeAdminCategory)?.name}
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {data.products
                                .filter((p: Product) => activeAdminCategory === "all" || p.category === activeAdminCategory)
                                .map((p: Product) => (
                                    <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4 hover:shadow-xl hover:border-primary/10 transition-all group">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-inner flex-shrink-0 relative group/img">
                                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity">
                                                    <Upload className="w-6 h-6 text-white" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(file, 'products', (url) => updateProduct(p.id, 'image', url));
                                                        }}
                                                    />
                                                </label>
                                                {uploading === 'products' && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <input
                                                    value={p.name}
                                                    onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                                                    className="font-bold text-lg w-full bg-slate-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20"
                                                />
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={p.category}
                                                        onChange={(e) => updateProduct(p.id, 'category', e.target.value)}
                                                        className="text-[10px] font-black uppercase tracking-widest bg-slate-100 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary/20"
                                                    >
                                                        {data.categories.map((c: any) => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                    <span className="text-sm font-bold text-slate-400">R$</span>
                                                    <input
                                                        type="number"
                                                        value={p.price}
                                                        onChange={(e) => updateProduct(p.id, 'price', parseFloat(e.target.value))}
                                                        className="font-black text-primary text-xl w-32 bg-slate-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <textarea
                                            value={p.description}
                                            onChange={(e) => updateProduct(p.id, 'description', e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm text-slate-600 min-h-[80px] focus:ring-2 focus:ring-primary/20"
                                            placeholder="Descrição do produto..."
                                        />

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-3">
                                                <label className="text-xs font-black uppercase text-slate-400">Disponível</label>
                                                <input
                                                    type="checkbox"
                                                    checked={p.available}
                                                    onChange={(e) => updateProduct(p.id, 'available', e.target.checked)}
                                                    className="w-6 h-6 text-primary rounded-lg border-slate-200 focus:ring-primary/20"
                                                />
                                            </div>
                                            <button
                                                onClick={() => deleteProduct(p.id)}
                                                className="p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <button
                            onClick={addCategory}
                            className="w-full border-2 border-dashed border-primary/30 text-primary p-6 rounded-[2.5rem] hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
                        >
                            <Plus className="w-6 h-6" /> Adicionar Categoria
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.categories.map((cat: Category) => (
                                <div key={cat.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all font-black">
                                        {cat.name[0]}
                                    </div>
                                    <input
                                        value={cat.name}
                                        onChange={(e) => updateCategory(cat.id, e.target.value)}
                                        className="font-bold text-lg w-full bg-transparent border-none focus:ring-0"
                                    />
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 max-w-2xl space-y-8">
                        <div className="grid gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pl-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Nome da Loja</label>
                                    <button
                                        onClick={() => {
                                            if (confirm("Deseja voltar para o nome padrão do Branding?")) {
                                                setData({ ...data, store: { ...data.store, name: BRANDING.name } });
                                            }
                                        }}
                                        className="text-[10px] text-primary hover:underline font-bold"
                                    >
                                        Resgatar do Branding
                                    </button>
                                </div>
                                <input
                                    value={data.store.name}
                                    onChange={(e) => setData({ ...data, store: { ...data.store, name: e.target.value } })}
                                    placeholder="Digite o nome do restaurante aqui..."
                                    className="w-full bg-slate-50 border-2 border-primary/10 rounded-2xl p-5 font-bold text-xl text-primary focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2">WhatsApp (com DDD)</label>
                                <input
                                    value={data.store.whatsapp}
                                    onChange={(e) => setData({ ...data, store: { ...data.store, whatsapp: e.target.value } })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-lg focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Tempo Médio de Entrega
                                </label>
                                <input
                                    value={data.store.deliveryTime || ''}
                                    onChange={(e) => setData({ ...data, store: { ...data.store, deliveryTime: e.target.value } })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-lg focus:ring-2 focus:ring-primary/20"
                                    placeholder="Ex: 40-60 min"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center justify-between">
                                    <span>URL da Logomarca</span>
                                    <label className="text-primary cursor-pointer hover:underline flex items-center gap-1 lowercase">
                                        <Upload className="w-3 h-3" />
                                        {uploading === 'logo' ? 'Enviando...' : 'Fazer Upload'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file, 'logo', (url: string) => setData({ ...data, store: { ...data.store, logo: url } }));
                                            }}
                                        />
                                    </label>
                                </label>
                                <input
                                    value={data.store.logo}
                                    onChange={(e) => setData({ ...data, store: { ...data.store, logo: e.target.value } })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2">Endereço</label>
                                <textarea
                                    value={data.store.address}
                                    onChange={(e) => setData({ ...data, store: { ...data.store, address: e.target.value } })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="font-bold text-slate-900">Formas de Pagamento</h3>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2">Chave PIX (E-mail, CPF ou Telefone)</label>
                                    <input
                                        value={data.store.pixKey || ''}
                                        onChange={(e) => setData({ ...data, store: { ...data.store, pixKey: e.target.value } })}
                                        placeholder="Ex: 11999999999"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-lg focus:ring-2 focus:ring-primary/20"
                                    />
                                    <p className="text-xs text-slate-400 pl-2">Deixe em branco se não quiser aceitar PIX</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center justify-between">
                                        <span>QR Code do PIX (Opcional)</span>
                                        <label className="text-primary cursor-pointer hover:underline flex items-center gap-1 lowercase">
                                            <Upload className="w-3 h-3" />
                                            {uploading === 'qrcode' ? 'Enviando...' : 'Fazer Upload'}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(file, 'qrcode', (url) => setData({ ...data, store: { ...data.store, pixQrCode: url } }));
                                                }}
                                            />
                                        </label>
                                    </label>
                                    {data.store.pixQrCode && (
                                        <div className="bg-slate-50 p-4 rounded-2xl flex justify-center mb-2 relative group">
                                            <img src={data.store.pixQrCode} alt="QR Code" className="w-32 h-32 object-contain" />
                                            <button
                                                onClick={() => setData({ ...data, store: { ...data.store, pixQrCode: "" } })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.store.acceptsCard !== false}
                                            onChange={(e) => setData({ ...data, store: { ...data.store, acceptsCard: e.target.checked } })}
                                            className="w-5 h-5 text-primary rounded-lg border-slate-300 focus:ring-primary/20"
                                        />
                                        <span className="font-bold text-slate-700">Aceitar Cartão (Crédito/Débito)</span>
                                    </label>

                                    <label className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.store.acceptsCash !== false}
                                            onChange={(e) => setData({ ...data, store: { ...data.store, acceptsCash: e.target.checked } })}
                                            className="w-5 h-5 text-primary rounded-lg border-slate-300 focus:ring-primary/20"
                                        />
                                        <span className="font-bold text-slate-700">Aceitar Dinheiro</span>
                                    </label>
                                </div>

                                {/* Horário de Funcionamento */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900">Horário de Funcionamento</h3>
                                        <Clock className="w-5 h-5 text-slate-400" />
                                    </div>

                                    <div className="grid gap-3">
                                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                            const labels: any = {
                                                monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
                                                thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo'
                                            };
                                            const schedule = (data.store.openingHours && data.store.openingHours[day]) || (BRANDING as any).openingHours[day];
                                            return (
                                                <div key={day} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl">
                                                    <span className="w-20 font-bold text-xs uppercase text-slate-500">{labels[day]}</span>

                                                    {!schedule.closed ? (
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input
                                                                type="time"
                                                                value={schedule.open}
                                                                onChange={(e) => setData({
                                                                    ...data,
                                                                    store: {
                                                                        ...data.store,
                                                                        openingHours: {
                                                                            ...(data.store.openingHours || (BRANDING as any).openingHours),
                                                                            [day]: { ...schedule, open: e.target.value }
                                                                        }
                                                                    }
                                                                })}
                                                                className="bg-white border-none rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                                                            />
                                                            <span className="text-slate-300">até</span>
                                                            <input
                                                                type="time"
                                                                value={schedule.close}
                                                                onChange={(e) => setData({
                                                                    ...data,
                                                                    store: {
                                                                        ...data.store,
                                                                        openingHours: {
                                                                            ...(data.store.openingHours || (BRANDING as any).openingHours),
                                                                            [day]: { ...schedule, close: e.target.value }
                                                                        }
                                                                    }
                                                                })}
                                                                className="bg-white border-none rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="flex-1 text-center font-bold text-red-400 text-xs italic">FECHADO O DIA TODO</span>
                                                    )}

                                                    <button
                                                        onClick={() => setData({
                                                            ...data,
                                                            store: {
                                                                ...data.store,
                                                                openingHours: {
                                                                    ...(data.store.openingHours || (BRANDING as any).openingHours),
                                                                    [day]: { ...schedule, closed: !schedule.closed }
                                                                }
                                                            }
                                                        })}
                                                        className={cn(
                                                            "ml-auto text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-all",
                                                            schedule.closed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                        )}
                                                    >
                                                        {schedule.closed ? "Abrir" : "Fechar"}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Taxas de Entrega por Bairro */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900">Taxas de Entrega (Bairros)</h3>
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="grid gap-2">
                                        {(data.store.deliveryFees || []).map((bairro: any, index: number) => (
                                            <div key={bairro.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl">
                                                <input
                                                    className="flex-1 bg-white border-none rounded-lg p-2 text-xs font-bold"
                                                    value={bairro.name}
                                                    onChange={(e) => {
                                                        const newFees = [...data.store.deliveryFees];
                                                        newFees[index].name = e.target.value;
                                                        setData({ ...data, store: { ...data.store, deliveryFees: newFees } });
                                                    }}
                                                />
                                                <div className="flex items-center bg-white rounded-lg px-2">
                                                    <span className="text-[10px] font-bold text-slate-400 mr-1">R$</span>
                                                    <input
                                                        type="number"
                                                        className="w-16 bg-white border-none rounded-lg p-2 text-xs font-bold text-right"
                                                        value={bairro.fee}
                                                        onChange={(e) => {
                                                            const newFees = [...data.store.deliveryFees];
                                                            newFees[index].fee = parseFloat(e.target.value) || 0;
                                                            setData({ ...data, store: { ...data.store, deliveryFees: newFees } });
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newFees = data.store.deliveryFees.filter((_: any, i: number) => i !== index);
                                                        setData({ ...data, store: { ...data.store, deliveryFees: newFees } });
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newBairro = { id: Math.random().toString(36).substr(2, 9), name: "Novo Bairro", fee: 0 };
                                                setData({ ...data, store: { ...data.store, deliveryFees: [...(data.store.deliveryFees || []), newBairro] } });
                                            }}
                                            className="text-xs font-bold text-primary flex items-center gap-1 p-2 hover:bg-primary/5 rounded-xl w-fit transition-all active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" /> Adicionar Bairro
                                        </button>
                                    </div>
                                </div>

                                {/* Link de Avaliação */}
                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center gap-2">
                                        <ShoppingCart className="w-3 h-3" /> Link de Avaliação (Google/Outro)
                                    </label>
                                    <input
                                        value={data.store.reviewLink || ''}
                                        onChange={(e) => setData({ ...data, store: { ...data.store, reviewLink: e.target.value } })}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-primary/20"
                                        placeholder="https://g.page/sua-loja/review"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'banners' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Novo Banner */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 gap-4">
                                <div className="p-4 bg-primary/5 rounded-full">
                                    <Images className="w-8 h-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-black text-slate-800">Adicionar Novo Banner</h3>
                                    <p className="text-sm text-slate-400">Cole a URL da imagem ou faça upload</p>
                                </div>
                                <div className="flex gap-2 w-full max-w-md">
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = (e.target as HTMLInputElement).value;
                                                if (val) setData((prev: any) => ({ ...prev, banners: [...(prev.banners || []), val] }));
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                    />
                                    <label className="bg-primary text-white px-6 rounded-xl flex items-center justify-center font-bold cursor-pointer hover:bg-primary/90 transition-all">
                                        Upload
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file, 'banners', (url) => setData((prev: any) => ({ ...prev, banners: [...(prev.banners || []), url] })));
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Lista de Banners */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.banners?.map((banner: string, index: number) => (
                                    <div key={index} className="relative group rounded-2xl overflow-hidden shadow-md aspect-video bg-slate-100">
                                        <img src={banner} className="w-full h-full object-cover" alt="Banner" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const newBanners = [...data.banners];
                                                    newBanners.splice(index, 1);
                                                    setData({ ...data, banners: newBanners });
                                                }}
                                                className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
