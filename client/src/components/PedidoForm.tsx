import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, Send } from "lucide-react";

const BUSINESS_OPTIONS = [
  "Comidería",
  "Papelería",
  "Ropa",
  "Celulares",
  "Masajes",
  "Uñas Acrílicas",
  "Variedades",
  "Examen/Laboratorio",
  "Otros",
] as const;

const DELIVERY_OPTIONS = ["Local", "Delivery"] as const;

export default function PedidoForm() {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState<(typeof BUSINESS_OPTIONS)[number]>(BUSINESS_OPTIONS[0]);
  const [details, setDetails] = useState("");
  const [deliveryType, setDeliveryType] = useState<(typeof DELIVERY_OPTIONS)[number]>("Local");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const crearPedido = trpc.orders.create.useMutation({
    onSuccess: () => {
      setClientName("");
      setPhone("");
      setBusiness(BUSINESS_OPTIONS[0]);
      setDetails("");
      setDeliveryType("Local");
      setDeliveryAddress("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    crearPedido.mutate({
      clientName,
      phone,
      business,
      details,
      deliveryType,
      deliveryAddress: deliveryType === "Delivery" ? deliveryAddress : "",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo cinematográfico */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-orange-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1)_0%,transparent_50%)]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">ASIS24</h1>
            <p className="text-cyan-300 text-sm font-semibold tracking-widest">HACER UN PEDIDO</p>
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-orange-500 mx-auto mt-4"></div>
          </div>

          {showSuccess && (
            <div className="mb-6 bg-emerald-900/50 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 size={20} />
              Pedido creado con éxito
            </div>
          )}

          {crearPedido.isError && (
            <div className="mb-6 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
              Error al crear el pedido: {crearPedido.error.message}
            </div>
          )}

          <Card className="bg-slate-800/80 border-cyan-500/30 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <Label className="text-sm font-semibold text-cyan-300 mb-2">Nombre del cliente</Label>
                <Input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 mt-2"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-cyan-300 mb-2">Teléfono</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 mt-2"
                  placeholder="Número de contacto"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-cyan-300 mb-2">Negocio</Label>
                <Select value={business} onValueChange={(v) => setBusiness(v as typeof business)}>
                  <SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-slate-200 font-normal mt-2 w-full">
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
                <Label className="text-sm font-semibold text-cyan-300 mb-2">Detalles del pedido</Label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                  className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 mt-2"
                  placeholder="¿Qué necesitas?"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-cyan-300 mb-2">Tipo de entrega</Label>
                <Select value={deliveryType} onValueChange={(v) => setDeliveryType(v as typeof deliveryType)}>
                  <SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-slate-200 font-normal mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-cyan-500/30">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {deliveryType === "Delivery" && (
                <div>
                  <Label className="text-sm font-semibold text-cyan-300 mb-2">Dirección de entrega</Label>
                  <Input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-slate-400 mt-2"
                    placeholder="¿A dónde lo enviamos?"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={crearPedido.isPending}
                className="w-full bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 mt-6"
              >
                {crearPedido.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar pedido
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}