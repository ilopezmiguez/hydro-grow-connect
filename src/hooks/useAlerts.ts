
import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface SensorData {
  ph: number;
  ec: number;
  waterLevel: string;
  waterTemp: number;
  lightHours: number;
  lastWaterChange: Date;
}

interface AlertConfig {
  ph: { min: number; max: number };
  ec: { min: number; max: number };
  lightHours: { target: number; tolerance: number };
  waterChangeDays: number;
}

const DEFAULT_CONFIG: AlertConfig = {
  ph: { min: 5.0, max: 7.0 },
  ec: { min: 0.8, max: 2.8 },
  lightHours: { target: 16, tolerance: 2 },
  waterChangeDays: 7
};

export const useAlerts = (sensorData: SensorData, config: AlertConfig = DEFAULT_CONFIG) => {
  const lastAlerts = useRef<{[key: string]: number}>({});
  const ALERT_COOLDOWN = 30000; // 30 segundos entre alertas del mismo tipo

  const shouldShowAlert = (alertType: string): boolean => {
    const now = Date.now();
    const lastShown = lastAlerts.current[alertType] || 0;
    
    if (now - lastShown > ALERT_COOLDOWN) {
      lastAlerts.current[alertType] = now;
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Alerta de pH Crítico
    if ((sensorData.ph < config.ph.min || sensorData.ph > config.ph.max) && shouldShowAlert('ph')) {
      toast({
        title: "🚨 ¡Alerta de pH!",
        description: `El pH actual es ${sensorData.ph.toFixed(1)}. ¡Necesita ajuste urgente!`,
        variant: "destructive",
      });
    }

    // Alerta de EC/TDS Crítico
    if ((sensorData.ec < config.ec.min || sensorData.ec > config.ec.max) && shouldShowAlert('ec')) {
      const isLow = sensorData.ec < config.ec.min;
      toast({
        title: "⚠️ ¡Alerta de Nutrientes!",
        description: `La EC actual es ${sensorData.ec.toFixed(1)} mS/cm. ${isLow ? 'Muy baja' : 'Muy alta'}. ¡Verifica la concentración!`,
        variant: "destructive",
      });
    }

    // Alerta de Nivel de Agua Bajo
    if (sensorData.waterLevel === "Bajo" && shouldShowAlert('waterLevel')) {
      toast({
        title: "💧 ¡Atención!",
        description: "El nivel de la solución hidropónica es bajo. ¡Es hora de rellenar el tanque!",
        variant: "destructive",
      });
    }

    // Recordatorio de Cambio de Agua
    const daysSinceChange = Math.floor(
      (Date.now() - sensorData.lastWaterChange.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceChange >= config.waterChangeDays && shouldShowAlert('waterChange')) {
      toast({
        title: "🗓️ ¡Recordatorio!",
        description: `Han pasado ${daysSinceChange} días desde el último cambio. Es hora de cambiar completamente la solución nutritiva.`,
        variant: "destructive",
      });
    }

    // Alerta de Tiempo de Luz Anormal
    const lightDifference = Math.abs(sensorData.lightHours - config.lightHours.target);
    if (lightDifference > config.lightHours.tolerance && shouldShowAlert('lightHours')) {
      const isExcess = sensorData.lightHours > config.lightHours.target;
      toast({
        title: "💡 ¡Alerta de Luces!",
        description: `Las luces han estado ${isExcess ? 'encendidas' : 'apagadas'} por un tiempo inusual (${sensorData.lightHours.toFixed(1)}h). ¡Verifica el temporizador!`,
        variant: "destructive",
      });
    }
  }, [sensorData, config]);

  return { config };
};
