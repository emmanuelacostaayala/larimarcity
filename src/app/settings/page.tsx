'use client';

import { useSettings } from '@/context/SettingsContext';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Settings2, DollarSign, FileCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

function CheckboxSetting({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary"
            />
            <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">{label}</p>
                {description && <p className="text-xs text-muted-foreground leading-snug">{description}</p>}
            </div>
        </label>
    );
}

export default function SettingsPage() {
    const { settings, updateSettings, resetSettings } = useSettings();
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Configuración</h2>
                <p className="text-sm text-muted-foreground mt-1">Valores predeterminados para nuevos contratos y datos del vendedor.</p>
            </div>

            {/* Vendor / Seller */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            <CardTitle>Datos del Vendedor</CardTitle>
                        </div>
                        <CardDescription>Personas que aparecen como representantes de INECAR en el contrato.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nombre del Notario</Label>
                            <Input
                                value={settings.notaryName}
                                onChange={(e) => updateSettings({ notaryName: e.target.value })}
                                placeholder="DR. FRANKLIN CASTILLO CALDERON"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Nombre del Representante Vendedor</Label>
                            <Input
                                value={settings.sellerName}
                                onChange={(e) => updateSettings({ sellerName: e.target.value })}
                                placeholder="ÁLVARO MECA RUBIO"
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Default Payment Settings */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <CardTitle>Plan de Pago Predeterminado</CardTitle>
                        </div>
                        <CardDescription>Valores iniciales al abrir un nuevo contrato.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Moneda Predeterminada</Label>
                            <Select
                                value={settings.defaultCurrency}
                                onValueChange={(v) => updateSettings({ defaultCurrency: v as 'EUR' | 'USD' })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EUR">Euros (€)</SelectItem>
                                    <SelectItem value="USD">US Dollars ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Cuotas de Construcción (default)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="60"
                                value={settings.defaultConstructionInstallments}
                                onChange={(e) => updateSettings({ defaultConstructionInstallments: Number(e.target.value) })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Default Clauses */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-primary" />
                            <CardTitle>Cláusulas Predeterminadas</CardTitle>
                        </div>
                        <CardDescription>Cláusulas que van activadas por defecto en cada nuevo contrato.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <CheckboxSetting
                            label="Interés por Pago Anticipado (7% anual)"
                            description="Inyecta la cláusula de PAGO ANTICIPADO."
                            checked={settings.defaultEarlyPaymentInterest}
                            onChange={(v) => updateSettings({ defaultEarlyPaymentInterest: v })}
                        />
                        <CheckboxSetting
                            label="Membresía Club de Golf"
                            description="Incluye términos de la membresía al Club de Golf."
                            checked={settings.defaultGolfMembership}
                            onChange={(v) => updateSettings({ defaultGolfMembership: v })}
                        />
                        <CheckboxSetting
                            label="Memoria de Calidades (Anexo I)"
                            description="Adjunta la Memoria de Calidades al final del contrato."
                            checked={settings.defaultQualityMemory}
                            onChange={(v) => updateSettings({ defaultQualityMemory: v })}
                        />
                        <CheckboxSetting
                            label="Alquiler Vacacional (_RENT)"
                            description="Añade el sufijo _RENT al nombre del archivo generado."
                            checked={settings.defaultVacationRental}
                            onChange={(v) => updateSettings({ defaultVacationRental: v })}
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between pb-8">
                <Button variant="outline" onClick={resetSettings} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Restablecer valores por defecto
                </Button>
                <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    {saved ? '✓ Guardado' : 'Guardar Cambios'}
                </Button>
            </motion.div>
        </div>
    );
}
