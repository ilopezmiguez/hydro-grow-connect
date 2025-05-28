
import { useState, useEffect } from 'react';

export interface HistoricalDataPoint {
  timestamp: Date;
  ph: number;
  ec: number;
  waterTemp: number;
}

export type TimePeriod = '24h' | '7d' | '30d';

export const useHistoricalData = (period: TimePeriod) => {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const points: HistoricalDataPoint[] = [];
      
      let intervalMinutes: number;
      let totalPoints: number;
      
      switch (period) {
        case '24h':
          intervalMinutes = 30; // Punto cada 30 minutos
          totalPoints = 48; // 24 horas
          break;
        case '7d':
          intervalMinutes = 360; // Punto cada 6 horas
          totalPoints = 28; // 7 días
          break;
        case '30d':
          intervalMinutes = 1440; // Punto cada día
          totalPoints = 30; // 30 días
          break;
      }

      for (let i = totalPoints - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * intervalMinutes * 60 * 1000));
        
        // Generar datos realistas con tendencias
        const timeOfDay = timestamp.getHours();
        const dayOfWeek = timestamp.getDay();
        
        // pH: tendencia ligeramente ácida por las mañanas, más neutro por las tardes
        const phBase = 6.0 + Math.sin(timeOfDay * Math.PI / 12) * 0.3;
        const ph = Math.max(5.0, Math.min(7.5, phBase + (Math.random() - 0.5) * 0.4));
        
        // EC: mayor concentración después de agregar nutrientes (simular cada 3-4 días)
        const daysSinceNutrients = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24) % 4;
        const ecBase = 1.8 - (daysSinceNutrients * 0.2);
        const ec = Math.max(0.8, Math.min(2.8, ecBase + (Math.random() - 0.5) * 0.3));
        
        // Temperatura: más alta durante el día
        const tempBase = 22 + Math.sin(timeOfDay * Math.PI / 12) * 3;
        const waterTemp = Math.max(18, Math.min(28, tempBase + (Math.random() - 0.5) * 2));
        
        points.push({
          timestamp,
          ph: parseFloat(ph.toFixed(1)),
          ec: parseFloat(ec.toFixed(1)),
          waterTemp: parseFloat(waterTemp.toFixed(1))
        });
      }
      
      setData(points);
      setLoading(false);
    };

    setLoading(true);
    // Simular carga
    const timer = setTimeout(generateData, 500);
    
    return () => clearTimeout(timer);
  }, [period]);

  return { data, loading };
};
