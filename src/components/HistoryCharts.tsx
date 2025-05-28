
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useHistoricalData, TimePeriod } from "@/hooks/useHistoricalData";
import { Calendar, TrendingUp, Zap, Thermometer } from "lucide-react";

const HistoryCharts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('24h');
  const { data, loading } = useHistoricalData(selectedPeriod);

  const formatXAxisTick = (tickItem: any) => {
    const date = new Date(tickItem);
    switch (selectedPeriod) {
      case '24h':
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      case '30d':
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      default:
        return '';
    }
  };

  const chartConfig = {
    ph: {
      label: "pH",
      color: "hsl(142, 76%, 36%)", // emerald-600
    },
    ec: {
      label: "EC (mS/cm)",
      color: "hsl(217, 91%, 60%)", // blue-500
    },
    waterTemp: {
      label: "Temperatura (°C)",
      color: "hsl(25, 95%, 53%)", // orange-500
    }
  };

  const periodLabels = {
    '24h': 'Últimas 24 horas',
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días'
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con selector de período */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Historial de Datos
          </h2>
          <p className="text-gray-600">Análisis histórico de los parámetros del sistema</p>
        </div>
        
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as TimePeriod[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {periodLabels[period]}
            </Button>
          ))}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.length > 0 && (
          <>
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">pH Promedio</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {(data.reduce((acc, d) => acc + d.ph, 0) / data.length).toFixed(1)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">EC Promedio</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(data.reduce((acc, d) => acc + d.ec, 0) / data.length).toFixed(1)}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Temp. Promedio</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {(data.reduce((acc, d) => acc + d.waterTemp, 0) / data.length).toFixed(1)}°C
                    </p>
                  </div>
                  <Thermometer className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gráfico de pH */}
        <Card className="bg-white/60 backdrop-blur-sm border-emerald-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
              pH - {periodLabels[selectedPeriod]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={formatXAxisTick}
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(value) => new Date(value).toLocaleString('es-ES')}
                        formatter={(value) => [`${value}`, 'pH']}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ph" 
                    stroke={chartConfig.ph.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de EC */}
        <Card className="bg-white/60 backdrop-blur-sm border-blue-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              EC - {periodLabels[selectedPeriod]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={formatXAxisTick}
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(value) => new Date(value).toLocaleString('es-ES')}
                        formatter={(value) => [`${value} mS/cm`, 'EC']}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ec" 
                    stroke={chartConfig.ec.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Temperatura */}
        <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Temperatura - {periodLabels[selectedPeriod]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={formatXAxisTick}
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(value) => new Date(value).toLocaleString('es-ES')}
                        formatter={(value) => [`${value}°C`, 'Temperatura']}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waterTemp" 
                    stroke={chartConfig.waterTemp.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className="bg-white/60 backdrop-blur-sm border-emerald-100">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              📊 Datos simulados en tiempo real
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              🔄 Actualización automática
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              📈 Gráficos interactivos con zoom
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryCharts;
