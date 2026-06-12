import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, LogOut, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [filterBusiness, setFilterBusiness] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loginError, setLoginError] = useState("");

  const ordersQuery = trpc.orders.list.useQuery(
    {
      business: filterBusiness === "all" ? undefined : filterBusiness,
      status: filterStatus === "all" ? undefined : filterStatus,
    },
    { enabled: isLoggedIn }
  );

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      setLoginError("");
      ordersQuery.refetch();
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

  const deleteOrderMutation = trpc.orders.delete.useMutation({
    onSuccess: () => {
      ordersQuery.refetch();
    },
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      ordersQuery.refetch();
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
        <div className="flex justify-between items-center mb-8">
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

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-2">Filtrar por Negocio</label>
            <Select value={filterBusiness} onValueChange={setFilterBusiness}>
              <SelectTrigger className="bg-slate-800 border-cyan-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-cyan-500/30">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Comidería">Comidería</SelectItem>
                <SelectItem value="Papelería">Papelería</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-2">Filtrar por Estado</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-800 border-cyan-500/30 text-white">
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
                    <p className="text-white font-bold">{order.business}</p>
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
                  <p className="text-white">{order.address}</p>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <Select
                    value={order.status}
                    onValueChange={(newStatus) =>
                      updateStatusMutation.mutate({ orderId: order.id, status: newStatus })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-cyan-500/30 text-white flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Enviado al negocio">Enviado al negocio</SelectItem>
                      <SelectItem value="Entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>

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
      </div>
    </div>
  );
}
