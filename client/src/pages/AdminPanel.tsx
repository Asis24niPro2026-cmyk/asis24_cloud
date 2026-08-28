import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, LogOut, Trash2, Eye, EyeOff, MessageCircle, Pencil, Plus, X } from "lucide-react";

const CENTRAL_WHATSAPP = "50583629444";

const BUSINESS_OPTIONS = [
  "Comidería",
  "Papelería",
  "Ropa",
  "Celulares",
  "Masajes",
  "Uñas Acrílicas",
  "Variedades",
   "Examen/Laboratorio",
  "Barbería",
  "Artículos de Segunda",
  "Otros",
] as const; 

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "businesses">("orders");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      setLoginError("");
    },
    onError: (error) => {
      setLoginError(error.message || "Error al iniciar sesión");
    },
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      setIsLoggedIn(false);
      setUsername("");
      setPassword("");
      setLoginError("");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    loginMutation.mutate({ username, password });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Fondo cinematográfico */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-orange-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1)_0%,transparent_50%)]"></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">ASIS24</h1>
              <p className="text-cyan-300 text-sm font-semibold tracking-widest">PANEL ADMINISTRATIVO</p>
              <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-orange-500 mx-auto mt-4"></div>
            </div>

            <Card className="bg-slate-800/80 border-cyan-500/30 backdrop-blur-sm">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>

                {loginError && (
                  <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">Usuario</label>
                    <Input
                      type="text"
                      placeholder="Usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400"
                      disabled={loginMutation.isPending}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">Contraseña</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 pr-10"
                        disabled={loginMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-cyan-200"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 mt-6"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-orange-900">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">ASIS24</h1>
            <p className="text-cyan-300 text-sm font-semibold">Panel de Administración</p>
          </div>
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            {logoutMutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} />
            )}
            Cerrar Sesión
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-cyan-500 to-orange-500 text-white"
                : "bg-slate-800 text-cyan-300 hover:bg-slate-700"
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab("businesses")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === "businesses"
                ? "bg-gradient-to-r from-cyan-500 to-orange-500 text-white"
                : "bg-slate-800 text-cyan-300 hover:bg-slate-700"
            }`}
          >
            Gestionar Negocios
          </button>
        </div>

        {activeTab === "orders" ? <OrdersTab /> : <BusinessesTab />}

        <p className="text-center text-slate-400 text-xs mt-10 pb-4">
          © ASIS24-NICARAGUA EVEBOT {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBusinessId, setFilterBusinessId] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const businessesQuery = trpc.businesses.list.useQuery(
    filterCategory === "all" ? undefined : { category: filterCategory as any }
  );

  const ordersQuery = trpc.orders.list.useQuery({
    category: filterCategory === "all" ? undefined : (filterCategory as any),
    businessId: filterBusinessId === "all" ? undefined : Number(filterBusinessId),
    status: filterStatus === "all" ? undefined : (filterStatus as any),
  });

  const deleteOrderMutation = trpc.orders.delete.useMutation({
    onSuccess: () => ordersQuery.refetch(),
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => ordersQuery.refetch(),
  });

  return (
    <>
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-cyan-300 mb-2">Filtrar por Categoría</label>
          <Select
            value={filterCategory}
            onValueChange={(v) => {
              setFilterCategory(v);
              setFilterBusinessId("all");
            }}
          >
            <SelectTrigger className="bg-slate-800 border-cyan-500/30 text-slate-100 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30">
              <SelectItem value="all">Todas</SelectItem>
              {BUSINESS_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyan-300 mb-2">Filtrar por Negocio</label>
          <Select value={filterBusinessId} onValueChange={setFilterBusinessId}>
            <SelectTrigger className="bg-slate-800 border-cyan-500/30 text-slate-100 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30">
              <SelectItem value="all">Todos</SelectItem>
              {businessesQuery.data?.map((b: any) => (
                <SelectItem key={b.id} value={String(b.id)}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyan-300 mb-2">Filtrar por Estado</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-slate-800 border-cyan-500/30 text-slate-100 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Enviado al negocio">Enviado al negocio</SelectItem>
              <SelectItem value="Entregado">Entregado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {ordersQuery.isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          </div>
        ) : ordersQuery.data?.length === 0 ? (
          <Card className="bg-slate-800/80 border-cyan-500/30 p-8 text-center">
            <p className="text-slate-400">No hay pedidos que coincidan con los filtros</p>
          </Card>
        ) : (
          ordersQuery.data?.map((order: any) => (
            <Card key={order.id} className="bg-slate-800/80 border-cyan-500/30 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-cyan-300 text-sm font-semibold">Cliente</p>
                  <p className="text-white font-bold">{order.clientName}</p>
                </div>
                <div>
                  <p className="text-cyan-300 text-sm font-semibold">Teléfono</p>
                  <p className="text-white font-bold">{order.phone}</p>
                </div>
                <div>
                  <p className="text-cyan-300 text-sm font-semibold">Negocio</p>
                  <p className="text-white font-bold">
                    {order.businessName ?? "—"}{" "}
                    <span className="text-slate-400 font-normal text-sm">({order.businessCategory})</span>
                  </p>
                </div>
                <div>
                  <p className="text-cyan-300 text-sm font-semibold">Estado</p>
                  <p className="text-white font-bold">{order.status}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-cyan-300 text-sm font-semibold">Pedido</p>
                <p className="text-white">{order.details}</p>
              </div>

              <div className="mb-4">
                <p className="text-cyan-300 text-sm font-semibold">Dirección</p>
                <p className="text-white">{order.deliveryAddress || "—"}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <Select
                  value={order.status}
                  onValueChange={(newStatus) =>
                    updateStatusMutation.mutate({ orderId: order.id, status: newStatus })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-cyan-500/30 text-slate-100 font-medium flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-cyan-500/30">
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Enviado al negocio">Enviado al negocio</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    const mensaje =
                      `*Nuevo pedido ASIS24*\n\n` +
                      `Cliente: ${order.clientName}\n` +
                      `Teléfono: ${order.phone}\n` +
                      `Negocio: ${order.businessName ?? ""}\n` +
                      `Pedido: ${order.details}\n` +
                      `Entrega: ${order.deliveryType}` +
                      (order.deliveryType === "Delivery" && order.deliveryAddress
                        ? `\nDirección: ${order.deliveryAddress}`
                        : "") +
                      `\nEstado: ${order.status}`;
                    const destino = order.businessWhatsapp || CENTRAL_WHATSAPP;
                    const url = `https://wa.me/${destino}?text=${encodeURIComponent(mensaje)}`;
                    window.open(url, "_blank");
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                  title={
                    order.businessWhatsapp
                      ? "Se enviará directo al WhatsApp del negocio"
                      : "Este negocio no tiene WhatsApp registrado; se enviará al número central"
                  }
                >
                  <MessageCircle size={18} />
                  Enviar por WhatsApp
                </Button>

                <Button
                  onClick={() => deleteOrderMutation.mutate({ orderId: order.id })}
                  disabled={deleteOrderMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                  {deleteOrderMutation.isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  Eliminar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

function BusinessesTab() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof BUSINESS_OPTIONS)[number]>(BUSINESS_OPTIONS[0]);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const businessesQuery = trpc.businesses.list.useQuery(
    filterCategory === "all" ? undefined : { category: filterCategory as any }
  );

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setCategory(BUSINESS_OPTIONS[0]);
    setWhatsappNumber("");
  };

  const createMutation = trpc.businesses.create.useMutation({
    onSuccess: () => {
      businessesQuery.refetch();
      resetForm();
    },
  });

  const updateMutation = trpc.businesses.update.useMutation({
    onSuccess: () => {
      businessesQuery.refetch();
      resetForm();
    },
  });

  const deleteMutation = trpc.businesses.delete.useMutation({
    onSuccess: () => businessesQuery.refetch(),
  });

  const startEdit = (b: any) => {
    setEditingId(b.id);
    setName(b.name);
    setCategory(b.category);
    setWhatsappNumber(b.whatsappNumber ?? "");
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        businessId: editingId,
        name,
        category,
        whatsappNumber: whatsappNumber || undefined,
      });
    } else {
      createMutation.mutate({ name, category, whatsappNumber: whatsappNumber || undefined });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-64">
          <label className="block text-sm font-semibold text-cyan-300 mb-2">Filtrar por Categoría</label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-slate-800 border-cyan-500/30 text-slate-100 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30">
              <SelectItem value="all">Todas</SelectItem>
              {BUSINESS_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar Negocio
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-slate-800/80 border-cyan-500/30 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">
              {editingId ? "Editar negocio" : "Nuevo negocio"}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-cyan-300 mb-2">Nombre del negocio</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ej. Comedor Martha"
                className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-cyan-300 mb-2">Categoría</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                <SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-slate-100 font-medium mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-500/30">
                  {BUSINESS_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-cyan-300 mb-2">WhatsApp del negocio (opcional)</Label>
              <Input
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ej. 50588887777 (sin espacios ni +)"
                className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 mt-2"
              />
              <p className="text-slate-400 text-xs mt-1">
                Si lo dejas vacío, los pedidos de este negocio se enviarán al WhatsApp central de ASIS24.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> : null}
              {editingId ? "Guardar cambios" : "Agregar negocio"}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {businessesQuery.isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          </div>
        ) : businessesQuery.data?.length === 0 ? (
          <Card className="bg-slate-800/80 border-cyan-500/30 p-8 text-center">
            <p className="text-slate-400">No hay negocios registrados todavía</p>
          </Card>
        ) : (
          businessesQuery.data?.map((b: any) => (
            <Card
              key={b.id}
              className="bg-slate-800/80 border-cyan-500/30 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <p className="text-white font-bold">{b.name}</p>
                <p className="text-cyan-300 text-sm">{b.category}</p>
                <p className="text-slate-400 text-sm">
                  {b.whatsappNumber ? `WhatsApp: ${b.whatsappNumber}` : "Sin WhatsApp (usa el número central)"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => startEdit(b)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Editar
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate({ businessId: b.id })}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
