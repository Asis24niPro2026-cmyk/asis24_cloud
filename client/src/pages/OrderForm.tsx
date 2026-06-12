import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

export default function OrderForm() {
  const [formData, setFormData] = useState<{
    clientName: string;
    phone: string;
    business: "Comidería" | "Papelería" | "Ropa" | "Celulares" | "Masajes" | "Uñas Acrílicas" | "Variedades" | "Examen/Laboratorio" | "Otros" | "";
    details: string;
    deliveryType: "Local" | "Delivery" | "";
    deliveryAddress: string;
  }>({
    clientName: "",
    phone: "",
    business: "",
    details: "",
    deliveryType: "",
    deliveryAddress: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<typeof formData | null>(null);

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      setSuccessData(formData);
      setShowSuccess(true);
      setFormData({
        clientName: "",
        phone: "",
        business: "",
        details: "",
        deliveryType: "",
        deliveryAddress: "",
      });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.phone || !formData.business || !formData.details || !formData.deliveryType) {
      alert("Por favor completa todos los campos");
      return;
    }
    if (formData.deliveryType === "Delivery" && !formData.deliveryAddress) {
      alert("Por favor ingresa la dirección de entrega");
      return;
    }
    createOrderMutation.mutate({
      clientName: formData.clientName,
      phone: formData.phone,
      business: formData.business as "Comidería" | "Papelería" | "Ropa" | "Celulares" | "Masajes" | "Uñas Acrílicas" | "Variedades" | "Examen/Laboratorio" | "Otros",
      details: formData.details,
      deliveryType: formData.deliveryType as "Local" | "Delivery",
      deliveryAddress: formData.deliveryAddress || "",
    });
  };

  const handleWhatsAppClick = () => {
    if (!successData) return;
    const deliveryInfo = successData.deliveryType === "Delivery" 
      ? `*Dirección:* ${successData.deliveryAddress}` 
      : "*Tipo:* Local";
    const message = `*Nuevo Pedido ASIS24*\n\n*Cliente:* ${successData.clientName}\n*Teléfono:* ${successData.phone}\n*Negocio:* ${successData.business}\n*Pedido:* ${successData.details}\n${deliveryInfo}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/50583629444?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Fondo cinematográfico con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-orange-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1)_0%,transparent_50%)]"></div>

      {/* Contenido */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">ASIS24</h1>
            <p className="text-cyan-300 text-sm font-semibold tracking-widest">GESTIÓN DE PEDIDOS</p>
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-orange-500 mx-auto mt-4"></div>
          </div>

          {!showSuccess ? (
            <Card className="bg-slate-800/80 border-cyan-500/30 backdrop-blur-sm">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Registrar Pedido</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">Nombre del Cliente</label>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">Teléfono</label>
                    <Input
                      type="tel"
                      placeholder="Tu teléfono"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">Negocio</label>
                    <Select value={formData.business} onValueChange={(value) => setFormData({ ...formData, business: value as any })}>
                      <SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-white">
                        <SelectValue placeholder="Selecciona un negocio" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-cyan-500/30">
                        <SelectItem value="Comidería" className="text-white">Comidería</SelectItem>
                        <SelectItem value="Papelería" className="text-white">Papelería</SelectItem>
                        <SelectItem value="Ropa" className="text-white">Ropa</SelectItem>
                        <SelectItem value="Celulares" className="text-white">Celulares</SelectItem>
                        <SelectItem value="Masajes" className="text-white">Masajes</SelectItem>
                        <SelectItem value="Uñas Acrílicas" className="text-white">Uñas Acrílicas</SelectItem>
                        <SelectItem value="Variedades" className="text-white">Variedades</SelectItem>
                        <SelectItem value="Examen/Laboratorio" className="text-white">Examen/Laboratorio</SelectItem>
                        <SelectItem value="Otros" className="text-white">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">Descripción del Pedido</label>
                    <Textarea
                      placeholder="Describe tu pedido en detalle"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">Tipo de Entrega</label>
                    <Select value={formData.deliveryType} onValueChange={(value) => setFormData({ ...formData, deliveryType: value as "Local" | "Delivery" | "" })}>
                      <SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-white">
                        <SelectValue placeholder="Selecciona tipo de entrega" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-cyan-500/30">
                        <SelectItem value="Local" className="text-white">Local</SelectItem>
                        <SelectItem value="Delivery" className="text-white">Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.deliveryType === "Delivery" && (
                    <div>
                      <label className="block text-sm font-semibold text-cyan-300 mb-2">Dirección de Entrega</label>
                      <Input
                        type="text"
                        placeholder="Tu dirección"
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 mt-6"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Pedido"
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border-green-500/50 backdrop-blur-sm">
              <div className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">¡Pedido Recibido!</h2>
                <p className="text-green-300 mb-6">Tu pedido ha sido registrado exitosamente. Nos pondremos en contacto contigo pronto.</p>

                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  >
                    Enviar Detalles por WhatsApp (Opcional)
                  </Button>

                  <Button
                    onClick={() => setShowSuccess(false)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  >
                    Hacer Otro Pedido
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6 px-4">
        <p className="text-slate-400 text-xs">© 2026 ASIS24-evebot-NICARAGUA</p>
      </div>
    </div>
  );
}
