
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarField from '../components/StarField';
import MouseGlow from '../components/MouseGlow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterPlot
} from 'recharts';

interface DataAnalysisResponse {
  columnStats: {
    [key: string]: {
      type: string;
      nullCount: number;
      uniqueCount: number;
      mean?: number;
      median?: number;
      min?: number;
      max?: number;
      skewness?: number;
      kurtosis?: number;
      correlations?: { [key: string]: number };
    };
  };
  visualizations: {
    [key: string]: {
      type: string;
      data: any[];
      options?: any;
    };
  };
  insights: string[];
}

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<DataAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const results = await response.json();
      setAnalysisResults(results);
      setFile(selectedFile);

      toast({
        title: "Analysis Complete",
        description: "Your data has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error analyzing your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white/90 font-montserrat">
      <StarField />
      <MouseGlow />
      
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* File Upload Section */}
        <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-montserrat font-light mb-4">Upload Your Data</h2>
          <Input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileUpload}
            className="bg-white/10 border-white/20"
            disabled={isLoading}
          />
          {isLoading && (
            <p className="mt-2 text-sm text-white/60">Analyzing your data...</p>
          )}
          {file && !isLoading && (
            <p className="mt-2 text-sm text-white/60">
              Analyzing: {file.name}
            </p>
          )}
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="space-y-8">
            {/* Column Statistics */}
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-montserrat font-light mb-6">Column Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(analysisResults.columnStats).map(([column, stats]) => (
                  <div key={column} className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-montserrat mb-2">{column}</h3>
                    <div className="text-sm text-white/70 space-y-1">
                      <p>Type: {stats.type}</p>
                      <p>Null Count: {stats.nullCount}</p>
                      <p>Unique Values: {stats.uniqueCount}</p>
                      {stats.type === 'numeric' && (
                        <>
                          <p>Mean: {stats.mean?.toFixed(2)}</p>
                          <p>Median: {stats.median?.toFixed(2)}</p>
                          <p>Range: {stats.min?.toFixed(2)} - {stats.max?.toFixed(2)}</p>
                          {stats.skewness && <p>Skewness: {stats.skewness.toFixed(2)}</p>}
                          {stats.kurtosis && <p>Kurtosis: {stats.kurtosis.toFixed(2)}</p>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visualizations */}
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-montserrat font-light mb-6">Visualizations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysisResults.visualizations).map(([key, viz]) => (
                  <div key={key} className="bg-white/5 p-4 rounded-lg h-[300px]">
                    <h3 className="text-lg font-montserrat mb-4">{key}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      {viz.type === 'pie' ? (
                        <PieChart>
                          <Pie
                            data={viz.data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                          >
                            {viz.data.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      ) : (
                        <BarChart data={viz.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            {analysisResults.insights.length > 0 && (
              <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="text-2xl font-montserrat font-light mb-6">Key Insights</h2>
                <ul className="space-y-2">
                  {analysisResults.insights.map((insight, index) => (
                    <li key={index} className="text-white/70">{insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DataAnalysis;
