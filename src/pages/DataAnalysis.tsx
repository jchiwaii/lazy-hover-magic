
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
  Cell
} from 'recharts';

interface DataPreview {
  columnStats: {
    [key: string]: {
      type: string;
      nullCount: number;
      uniqueCount: number;
      mean?: number;
      median?: number;
      min?: number;
      max?: number;
    };
  };
  sampleData: any[];
  visualizations: {
    [key: string]: {
      type: string;
      data: any[];
    };
  };
}

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      // For now, we'll just read CSV files
      if (selectedFile.type !== 'text/csv') {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }

      const text = await selectedFile.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          rowData[header.trim()] = values[index]?.trim();
        });
        return rowData;
      });

      // Calculate basic statistics
      const columnStats: DataPreview['columnStats'] = {};
      headers.forEach(header => {
        const values = data.map(row => row[header]).filter(Boolean);
        const numericValues = values.map(Number).filter(n => !isNaN(n));
        
        columnStats[header] = {
          type: numericValues.length === values.length ? 'numeric' : 'categorical',
          nullCount: data.length - values.length,
          uniqueCount: new Set(values).size,
          ...(numericValues.length === values.length && {
            mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
            median: numericValues.sort((a, b) => a - b)[Math.floor(numericValues.length / 2)],
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
          }),
        };
      });

      // Generate visualizations
      const visualizations: DataPreview['visualizations'] = {};
      headers.forEach(header => {
        if (columnStats[header].type === 'categorical') {
          const counts: { [key: string]: number } = {};
          data.forEach(row => {
            const value = row[header];
            counts[value] = (counts[value] || 0) + 1;
          });
          visualizations[header] = {
            type: 'pie',
            data: Object.entries(counts).map(([name, value]) => ({ name, value })),
          };
        } else {
          // For numeric columns, create histogram-like bar chart
          visualizations[header] = {
            type: 'bar',
            data: data.map(row => ({
              value: Number(row[header]),
            })),
          };
        }
      });

      setFile(selectedFile);
      setDataPreview({
        columnStats,
        sampleData: data.slice(0, 5),
        visualizations,
      });

      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been processed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white/90 font-montserrat">
      <StarField />
      <MouseGlow />
      
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col gap-8"
        >
          {/* File Upload Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-2xl font-montserrat font-light mb-4">Upload Your Data</h2>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="bg-white/10 border-white/20"
            />
            {file && (
              <p className="mt-2 text-sm text-white/60">
                File loaded: {file.name}
              </p>
            )}
          </motion.div>

          {/* Data Preview and EDA */}
          {dataPreview && (
            <motion.div 
              variants={itemVariants}
              className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-montserrat font-light mb-6">Data Analysis</h2>
              
              {/* Column Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Object.entries(dataPreview.columnStats).map(([column, stats]) => (
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
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visualizations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(dataPreview.visualizations).map(([column, viz]) => (
                  <div key={column} className="bg-white/5 p-4 rounded-lg h-[300px]">
                    <h3 className="text-lg font-montserrat mb-4">{column}</h3>
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
                            {viz.data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      ) : (
                        <BarChart data={viz.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DataAnalysis;
