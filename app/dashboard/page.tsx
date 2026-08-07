"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ReactMarkdown from "react-markdown"
import { supabase } from "@/lib/supabaseClient"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import {
  Brain,
  TrendingUp,
  Shield,
  Camera,
  Upload,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Leaf,
  DollarSign,
  Target,
  Sprout,
  Lock,
  User,
} from "lucide-react"
import Link from "next/link"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// // Register custom plugins
// ChartJS.register({
//   id: 'customPriceLabels',
//   afterDraw: function(chart: any) {
//     const ctx = chart.ctx
//     const meta = chart.getDatasetMeta(0)
    
//     if (meta.data) {
//       meta.data.forEach((bar: any, index: number) => {
//         const data = chart.data.datasets[0].data[index]
//         const x = bar.x
//         const y = bar.y - 10
        
//         ctx.save()
//         ctx.textAlign = 'center'
//         ctx.textBaseline = 'bottom'
//         ctx.font = 'bold 12px sans-serif'
//         ctx.fillStyle = '#374151'
//         ctx.fillText(`₹${data.toLocaleString()}`, x, y)
//         ctx.restore()
//       })
//     }
//   }
// })

// ChartJS.register({
//   id: 'customConnectingLine',
//   afterDraw: function(chart: any) {
//     const ctx = chart.ctx
//     const meta = chart.getDatasetMeta(0)
    
//     if (meta.data && meta.data.length >= 2) {
//       const bar1 = meta.data[0]
//       const bar2 = meta.data[1]
      
//       ctx.save()
//       ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
//       ctx.lineWidth = 2
//       ctx.setLineDash([5, 5])
//       ctx.beginPath()
//       ctx.moveTo(bar1.x, bar1.y)
//       ctx.lineTo(bar2.x, bar2.y)
//       ctx.stroke()
//       ctx.restore()
//     }
//   }
// })

const priceLabelsPlugin = {
  id: 'priceLabels',
  afterDraw: function(chart: any) {
    const ctx = chart.ctx
    const meta = chart.getDatasetMeta(0)
    if (meta.data) {
      meta.data.forEach((bar: any, index: number) => {
        const data = chart.data.datasets[0].data[index]
        const x = bar.x
        const y = bar.y - 10
        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.font = 'bold 12px sans-serif'
        ctx.fillStyle = '#374151'
        ctx.fillText(`₹${data.toLocaleString()}`, x, y)
        ctx.restore()
      })
    }
  }
}

const percentLabelsPlugin = {
  id: 'percentLabels',
  afterDraw: function(chart: any) {
    const ctx = chart.ctx
    const meta = chart.getDatasetMeta(0)
    if (meta.data) {
      meta.data.forEach((bar: any, index: number) => {
        const data = chart.data.datasets[0].data[index]
        const x = bar.x
        const y = bar.y - 10
        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.font = 'bold 12px sans-serif'
        ctx.fillStyle = '#374151'
        ctx.fillText(`${data}%`, x, y)
        ctx.restore()
      })
    }
  }
}

const customConnectingLine = {
  id: 'customConnectingLine',
  afterDraw: function(chart: any) {
    const ctx = chart.ctx
    const meta = chart.getDatasetMeta(0)
    if (meta.data && meta.data.length >= 2) {
      const bar1 = meta.data[0]
      const bar2 = meta.data[1]
      ctx.save()
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(bar1.x, bar1.y)
      ctx.lineTo(bar2.x, bar2.y)
      ctx.stroke()
      ctx.restore()
    }
  }
}

// Price Chart Component
function PriceChart({ currentPrice, predictedPrice, crop, district }: { 
  currentPrice: number; 
  predictedPrice: number; 
  crop: string; 
  district: string 
}) {
  const [chartLoaded, setChartLoaded] = useState(false)
  
  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => setChartLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const chartData = {
    labels: ['Current Price', 'Predicted Price'],
    datasets: [
      {
        label: 'Price per Quintal (₹)',
        data: [currentPrice, predictedPrice],
        backgroundColor: [
          'rgba(34, 197, 94, 0.15)',  // Green for current
          'rgba(59, 130, 246, 0.15)',  // Blue for predicted
        ],
        borderColor: [
          'rgba(34, 197, 94, 0.8)',     // Green for current
          'rgba(59, 130, 246, 0.8)',     // Blue for predicted
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.4, // Make bars thinner
        categoryPercentage: 0.6, // Space between bars
        hoverBackgroundColor: [
          'rgba(34, 197, 94, 0.25)',  // Green hover
          'rgba(59, 130, 246, 0.25)',  // Blue hover
        ],
        hoverBorderColor: [
          'rgba(34, 197, 94, 1)',     // Green hover border
          'rgba(59, 130, 246, 1)',     // Blue hover border
        ],
        hoverBorderWidth: 3,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${crop.charAt(0).toUpperCase() + crop.slice(1)} Price Forecast - ${district.charAt(0).toUpperCase() + district.slice(1)}`,
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#374151',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `₹${context.parsed.y.toLocaleString()} per Quintal`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return '₹' + value.toLocaleString()
          },
          font: {
            size: 11,
          },
          padding: 8,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 'bold' as const,
            size: 12,
          },
          padding: 8,
        }
      }
    }
  }

  return (
    <div className="w-full h-64">
      {!chartLoaded ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        </div>
      ) : (
        <Bar data={chartData} options={chartOptions} plugins={[priceLabelsPlugin,customConnectingLine]} />
      )}
    </div>
  )
}

// Crop Recommendations Chart Component
function CropChart({ crops }: { 
  crops: Array<{ name: string; probability: number; status: string }> 
}) {
  const [chartLoaded, setChartLoaded] = useState(false)
  
  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => setChartLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const chartData = {
    labels: crops.map(crop => crop.name),
    datasets: [
      {
        label: 'Yield Probability (%)',
        data: crops.map(crop => crop.probability),
        backgroundColor: crops.map((crop, index) => {
          if (crop.status.includes('Best')) {
            return 'rgba(34, 197, 94, 0.8)'  // Green for best match
          } else if (crop.status.includes('Good')) {
            return 'rgba(59, 130, 246, 0.8)'  // Blue for good match
          } else {
            return 'rgba(253, 224, 71, 0.8)'  // Gray for moderate match
          }
        }),
        borderColor: crops.map((crop, index) => {
          if (crop.status.includes('Best')) {
            return 'rgba(34, 197, 94, 1)'  // Green for best match
          } else if (crop.status.includes('Good')) {
            return 'rgba(59, 130, 246, 1)'  // Blue for good match
          } else {
            return 'rgba(167, 228, 12, 1)'  // Gray for moderate match
          }
        }),
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.5, // Make bars thinner
        categoryPercentage: 0.7, // Space between bars
        hoverBackgroundColor: crops.map((crop, index) => {
          if (crop.status.includes('Best')) {
            return 'rgba(34, 197, 94, 0.9)'  // Green hover
          } else if (crop.status.includes('Good')) {
            return 'rgba(59, 130, 246, 0.9)'  // Blue hover
          } else {
            return 'rgba(253, 224, 71, 1)'  // Gray hover
          }
        }),
        hoverBorderColor: crops.map((crop, index) => {
          if (crop.status.includes('Best')) {
            return 'rgba(34, 197, 94, 1)'  // Green hover border
          } else if (crop.status.includes('Good')) {
            return 'rgba(59, 130, 246, 1)'  // Blue hover border
          } else {
            return 'rgba(205, 208, 7, 1)'  // Gray hover border
          }
        }),
        hoverBorderWidth: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const crop = crops[context.dataIndex]
            return `${crop.name}: ${crop.probability}% (${crop.status})`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return value + '%'
          },
          font: {
            size: 11,
          },
          padding: 8,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 'bold' as const,
            size: 12,
          },
          padding: 8,
        }
      }
    }
  }

  return (
    <div className="w-full h-64">
      {!chartLoaded ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        </div>
      ) : (
        <Bar data={chartData} options={chartOptions} plugins={[percentLabelsPlugin]}/>
      )}
    </div>
  )
}

// Function to extract price data from AI response
function extractPriceData(aiResponse: string) {
  // Try to match the new format first
  let currentPriceMatch = aiResponse.match(/\*\*💰 Current Price\*\*: ₹(\d+(?:,\d+)*)/)
  let predictedPriceMatch = aiResponse.match(/\*\*📊 Predicted Price\*\*: ₹(\d+(?:,\d+)*)/)
  
  // Fallback to old format if new format not found
  if (!currentPriceMatch) {
    currentPriceMatch = aiResponse.match(/\*\*Current Price\*\*: ₹(\d+(?:,\d+)*)/)
  }
  if (!predictedPriceMatch) {
    predictedPriceMatch = aiResponse.match(/\*\*Predicted Price\*\*: ₹(\d+(?:,\d+)*)/)
  }
  
  // Additional fallback patterns
  if (!currentPriceMatch) {
    currentPriceMatch = aiResponse.match(/Current Price.*?₹(\d+(?:,\d+)*)/i)
  }
  if (!predictedPriceMatch) {
    predictedPriceMatch = aiResponse.match(/Predicted Price.*?₹(\d+(?:,\d+)*)/i)
  }
  
  let currentPrice = 0
  let predictedPrice = 0
  
  if (currentPriceMatch) {
    currentPrice = parseInt(currentPriceMatch[1].replace(/,/g, ''))
  }
  
  if (predictedPriceMatch) {
    predictedPrice = parseInt(predictedPriceMatch[1].replace(/,/g, ''))
  }
  
  return { currentPrice, predictedPrice }
}

// Function to extract yield data from crop recommendations AI response
function extractYieldData(aiResponse: string) {
  // Normalize line endings to \n
  const normalizedResponse = aiResponse.replace(/\r\n/g, '\n')
  
  // ===== STRATEGY 1: Parse the "Yield Analysis" summary section =====
  // Match various header formats: **Yield Analysis**, ## Yield Analysis, ### Yield Analysis, etc.
  const yieldSectionMatch = normalizedResponse.match(
    /(?:\*{1,2}\s*|#{1,3}\s*)Yield Analysis\s*\*{0,2}\s*\n([\s\S]*?)(?=\n\n|\n(?:\*{2}\s*|#{1,3}\s*)[A-Z]|$)/i
  )
  
  if (yieldSectionMatch) {
    const yieldSection = yieldSectionMatch[1]
    // Match any bullet style: •, -, *, numbered (1.), or ✅ — with optional bold crop names
    const bulletRegex = /(?:^|\n)\s*(?:•|[-*]|\d+[.)]\s*)\s*(?:✅\s*)?\*{0,2}([^:\n]+?)\*{0,2}\s*:\s*(\d+)%\s*\(([^)]+)\)/g
    const crops: Array<{ name: string; probability: number; status: string }> = []
    let match
    
    while ((match = bulletRegex.exec(yieldSection)) !== null) {
      crops.push({
        name: match[1].trim(),
        probability: parseInt(match[2]),
        status: match[3].trim()
      })
    }
    
    if (crops.length > 0) {
      crops.sort((a, b) => b.probability - a.probability)
      return crops
    }
  }
  
  // ===== STRATEGY 2: Parse individual crop sections with "Yield Probability:" lines =====
  // Match any emoji before "Crop N:" — not just 🌾
  const cropSectionRegex = /\*{0,2}\s*(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*)?Crop\s*\d+:\s*([^*\n]+?)\s*\*{0,2}\s*\n[\s\S]*?Yield Probability:\s*(\d+)%(?:\s*\(([^)]+)\))?/gu
  const crops2: Array<{ name: string; probability: number; status: string }> = []
  let sectionMatch
  
  while ((sectionMatch = cropSectionRegex.exec(normalizedResponse)) !== null) {
    const cropName = sectionMatch[1].trim()
    const probability = parseInt(sectionMatch[2])
    let status = sectionMatch[3]?.trim() || ""
    
    // Determine status from probability if not provided
    if (!status) {
      if (probability >= 80) {
        status = "Best Match"
      } else if (probability >= 70) {
        status = "Good Match"
      } else {
        status = "Moderate Match"
      }
    }
    
    crops2.push({ name: cropName, probability, status })
  }
  
  if (crops2.length > 0) {
    crops2.sort((a, b) => b.probability - a.probability)
    return crops2
  }
  
  // ===== STRATEGY 3: Fallback — find ANY "CropName: XX% (Status)" pattern in the response =====
  const genericRegex = /(?:•|[-*]|\d+[.)]\s*)\s*(?:✅\s*)?\*{0,2}([A-Za-z\s]+?)\*{0,2}\s*:\s*(\d+)%\s*\(([^)]+)\)/g
  const fallbackCrops: Array<{ name: string; probability: number; status: string }> = []
  let fallbackMatch
  
  while ((fallbackMatch = genericRegex.exec(normalizedResponse)) !== null) {
    const name = fallbackMatch[1].trim()
    // Skip generic labels like "Yield Probability" or section headers
    if (name.toLowerCase().includes('yield') || name.toLowerCase().includes('probability') || name.length > 30) {
      continue
    }
    fallbackCrops.push({
      name,
      probability: parseInt(fallbackMatch[2]),
      status: fallbackMatch[3].trim()
    })
  }
  
  if (fallbackCrops.length > 0) {
    // Deduplicate by crop name (keep first occurrence)
    const seen = new Set<string>()
    const uniqueCrops = fallbackCrops.filter(crop => {
      const key = crop.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    uniqueCrops.sort((a, b) => b.probability - a.probability)
    return uniqueCrops
  }
  
  // ===== STRATEGY 4: Last resort — find "Yield Probability: XX%" anywhere and pair with crop headers =====
  const yieldProbMatches = [...normalizedResponse.matchAll(/Yield Probability:\s*(\d+)%/g)]
  const cropHeaderMatches = [...normalizedResponse.matchAll(/(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*)?Crop\s*\d+:\s*([^*\n]+)/gu)]
  
  if (yieldProbMatches.length > 0 && cropHeaderMatches.length > 0) {
    const lastResortCrops: Array<{ name: string; probability: number; status: string }> = []
    const count = Math.min(yieldProbMatches.length, cropHeaderMatches.length)
    
    for (let i = 0; i < count; i++) {
      const probability = parseInt(yieldProbMatches[i][1])
      let status = "Moderate Match"
      if (probability >= 80) status = "Best Match"
      else if (probability >= 70) status = "Good Match"
      
      lastResortCrops.push({
        name: cropHeaderMatches[i][1].trim(),
        probability,
        status
      })
    }
    
    lastResortCrops.sort((a, b) => b.probability - a.probability)
    return lastResortCrops
  }
  
  return null
}

function AuthProtectedDashboard({ user, userProfile }: { user: any; userProfile: any }) {
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("recommendations")
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Crop recommendation states
  const [cropFormData, setCropFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  })
  const [cropRecommendations, setCropRecommendations] = useState<string>("")
  const [cropLoading, setCropLoading] = useState(false)
  const [cropError, setCropError] = useState<string>("")
  
  // Disease detection states
  const [diseaseAnalysis, setDiseaseAnalysis] = useState<string>("")
  const [diseaseLoading, setDiseaseLoading] = useState(false)
  const [diseaseError, setDiseaseError] = useState<string>("")
  
  // Price prediction states
  const [pricePredictions, setPricePredictions] = useState<string>("")
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceError, setPriceError] = useState<string>("")

  // Function to handle crop recommendation form input changes
  const handleCropInputChange = (field: string, value: string) => {
    setCropFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Function to clear form data
  const clearFormData = () => {
    setCropFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: ''
    })
    setCropRecommendations("")
    setCropError("")
  }

  // Function to clear disease analysis
  const clearDiseaseAnalysis = () => {
    setDiseaseAnalysis("")
    setDiseaseError("")
    setUploadedImage(null)
  }

  // Function to clear price predictions
  const clearPricePredictions = () => {
    setPricePredictions("")
    setPriceError("")
    setSelectedCrop("")
    setSelectedLocation("")
  }

  // Function to get price predictions from AI
  const getPricePredictions = async () => {
    if (!selectedCrop || !selectedLocation) {
      setPriceError("Please select both crop and district")
      return
    }

    setPriceLoading(true)
    setPriceError("")
    setPricePredictions("")
    
    try {
      const response = await fetch('/api/price-predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: selectedCrop,
          district: selectedLocation
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setPricePredictions(data.data.pricePredictions)
      } else {
        setPriceError(data.error || "Failed to get price predictions")
      }
    } catch (error) {
      console.error('Error getting price predictions:', error)
      setPriceError("Network error. Please try again.")
    } finally {
      setPriceLoading(false)
    }
  }

  // Function to analyze image for diseases using A4F API
  const analyzeImageForDiseases = async () => {
    if (!uploadedImage) {
      setDiseaseError("Please upload or capture an image first")
      return
    }

    setDiseaseLoading(true)
    setDiseaseError("")
    setDiseaseAnalysis("")
    
    try {
      const response = await fetch('/api/disease-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: uploadedImage
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setDiseaseAnalysis(data.data.diseaseAnalysis)
      } else {
        setDiseaseError(data.error || "Failed to analyze image")
      }
    } catch (error) {
      console.error('Error analyzing image for diseases:', error)
      setDiseaseError("Network error. Please try again.")
    } finally {
      setDiseaseLoading(false)
    }
  }

  // Function to get crop recommendations from AI
  const getCropRecommendations = async () => {
    // Validate that all fields are filled
    const requiredFields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']
    const emptyFields = requiredFields.filter(field => !cropFormData[field as keyof typeof cropFormData])
    
    if (emptyFields.length > 0) {
      setCropError(`Please fill in all required fields: ${emptyFields.join(', ')}`)
      return
    }

    setCropLoading(true)
    setCropError("")
    setCropRecommendations("")
    
    try {
      const response = await fetch('/api/crop-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropFormData)
      })

      const data = await response.json()
      
      if (data.success) {
        setCropRecommendations(data.data.aiRecommendations)
      } else {
        setCropError(data.error || "Failed to get recommendations")
      }
    } catch (error) {
      console.error('Error getting crop recommendations:', error)
      setCropError("Network error. Please try again.")
    } finally {
      setCropLoading(false)
    }
  }

  // Function to fetch weather data
  const fetchWeatherData = async (location: string) => {
    if (!location) return
    
    setWeatherLoading(true)
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)

      if (response.ok) {
        const data = await response.json()
        // Transform the data to match our expected format
        const transformedData = {
          temperature: data.current?.temp_c,
          condition: data.current?.condition?.text,
          humidity: data.current?.humidity,
          wind_speed: data.current?.wind_kph,
          feels_like: data.current?.feelslike_c,
          rain_chance: data.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 0,
          location: data.location?.name,
          region: data.location?.region,
          country: data.location?.country
        }
        setWeatherData(transformedData)
        // Store weather data in localStorage with timestamp for 24-hour caching
        localStorage.setItem('weatherData', JSON.stringify({
          data: transformedData,
          timestamp: Date.now(),
          location: location
        }))
      } else {
        console.error('Weather API error:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      setWeatherLoading(false)
    }
  }

  // Load weather data on component mount and when userProfile changes
  useEffect(() => {
    if (userProfile?.location) {
      // Check if we have cached weather data for this location
      const cachedWeather = localStorage.getItem('weatherData')
      if (cachedWeather) {
        const { data, timestamp, location } = JSON.parse(cachedWeather)
        const is5MinutesOld = Date.now() - timestamp > 5 * 60 * 1000 // 5 minutes in milliseconds
        
        if (location === userProfile.location && !is5MinutesOld) {
          setWeatherData(data)
          return
        }
      }
      
      // Fetch fresh weather data
      fetchWeatherData(userProfile.location)
    }
  }, [userProfile?.location])



  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Open camera and show preview
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setCameraStream(stream)
      setShowCamera(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      document.getElementById("image-upload")?.click()
    }
  }

  // Attach stream to video element
  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play()
    }
    return () => {
      // Stop camera when closing preview
      if (!showCamera && cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
      }
    }
  }, [showCamera, cameraStream])

  // Capture image from video
  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setUploadedImage(imageDataUrl)
        setShowCamera(false)
      }
    }
  }

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition?.toLowerCase()
    if (conditionLower?.includes('sunny') || conditionLower?.includes('clear') || conditionLower?.includes('partly cloudy')) {
      return <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('cloudy') || conditionLower?.includes('overcast') || conditionLower?.includes('mist')) {
      return <Sun className="h-8 w-8 text-gray-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('rain') || conditionLower?.includes('drizzle') || conditionLower?.includes('shower')) {
      return <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('storm') || conditionLower?.includes('thunder') || conditionLower?.includes('lightning')) {
      return <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('snow') || conditionLower?.includes('sleet')) {
      return <Droplets className="h-8 w-8 text-blue-300 mx-auto mb-2" />
    } else if (conditionLower?.includes('fog') || conditionLower?.includes('haze')) {
      return <Wind className="h-8 w-8 text-gray-400 mx-auto mb-2" />
    } else {
      return <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
    }
  }

  return (
    <main className="flex-1 bg-muted/30 pt-20">
      <div className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  {userProfile?.first_name || user?.email?.split('@')[0] || 'Farmer'}!
                </span>
              </h1>
              <p className="text-muted-foreground">Here's what's happening with your farm today.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2 sm:mt-0">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[120px] sm:max-w-none">{userProfile?.location || 'Location not set'}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-in-left">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Farm Area</p>
                  <p className="text-2xl font-bold">{userProfile?.farm_size || '25'} acres</p>
                </div>
                <Target className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Primary Crop</p>
                  <p className="text-2xl font-bold">{userProfile?.primary_crop || 'Wheat'}</p>
                </div>
                <Leaf className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Est. Revenue</p>
                  <p className="text-2xl font-bold">₹8.5L</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Insights</p>
                  <p className="text-2xl font-bold">3 Insights</p>
                </div>
                <Brain className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Widget */}
        <Card className="mb-8 animate-fade-in-up">
                     <CardHeader>
             <CardTitle className="flex items-center space-x-2">
               <Sun className="h-5 w-5 text-accent" />
               <span>Current Weather - {weatherData?.location || userProfile?.location || 'Location not set'}</span>
             </CardTitle>
           </CardHeader>
          <CardContent>
            {weatherLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <span className="ml-2 text-muted-foreground">Loading weather data...</span>
              </div>
            ) : weatherData ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mx-auto">
                <div className="text-center">
                  {getWeatherIcon(weatherData.condition)}
                  <p className="text-lg font-semibold">{weatherData.condition || 'Clear'}</p>
                  <p className="text-sm text-muted-foreground">Condition</p>
                </div>
                <div className="text-center">
                  <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{weatherData.humidity || '65'}%</p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </div>
                <div className="text-center">
                  <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{weatherData.wind_speed || '12'} km/h</p>
                  <p className="text-sm text-muted-foreground">Wind</p>
                </div>
                <div className="text-center">
                  <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{weatherData.temperature || '25'}°C</p>
                  <p className="text-sm text-muted-foreground">Temp</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Sun className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Weather data unavailable</p>
                {userProfile?.location && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchWeatherData(userProfile.location)}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

                 {/* AI Features Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in-up">
           {/* Mobile: Vertical tabs, Desktop: Horizontal tabs */}
           <div className="block sm:hidden mb-6">
             {/* Mobile Vertical Navigation */}
             <div className="space-y-3">
               <button
                 onClick={() => setActiveTab("recommendations")}
                 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                   activeTab === "recommendations" 
                     ? "bg-accent/10 border-accent/20" 
                     : "bg-muted/50 border-muted/30 hover:bg-muted/70"
                 }`}
               >
                 <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                   activeTab === "recommendations" ? "bg-accent/20" : "bg-muted"
                 }`}>
                   <Brain className={`h-5 w-5 ${
                     activeTab === "recommendations" ? "text-accent" : "text-muted-foreground"
                   }`} />
                 </span>
                 <div className="text-left">
                   <div className="font-semibold text-sm">Crop Recommendations</div>
                   <div className="text-xs text-muted-foreground">AI-powered crop suggestions</div>
                 </div>
               </button>
               
               <button
                 onClick={() => setActiveTab("predictions")}
                 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                   activeTab === "predictions" 
                     ? "bg-accent/10 border-accent/20" 
                     : "bg-muted/50 border-muted/30 hover:bg-muted/70"
                 }`}
               >
                 <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                   activeTab === "predictions" ? "bg-accent/20" : "bg-muted"
                 }`}>
                   <TrendingUp className={`h-5 w-5 ${
                     activeTab === "predictions" ? "text-accent" : "text-muted-foreground"
                   }`} />
                 </span>
                 <div className="text-left">
                   <div className="font-semibold text-sm">Price Predictions</div>
                   <div className="text-xs text-muted-foreground">Market forecasting tools</div>
                 </div>
               </button>
               
               <button
                 onClick={() => setActiveTab("detection")}
                 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                   activeTab === "detection" 
                     ? "bg-accent/10 border-accent/20" 
                     : "bg-muted/50 border-muted/30 hover:bg-muted/70"
                 }`}
               >
                 <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                   activeTab === "detection" ? "bg-accent/20" : "bg-muted"
                 }`}>
                   <Shield className={`h-5 w-5 ${
                     activeTab === "detection" ? "text-accent" : "text-muted-foreground"
                   }`} />
                 </span>
                 <div className="text-left">
                   <div className="font-semibold text-sm">Disease Detection</div>
                   <div className="text-xs text-muted-foreground">AI-powered crop analysis</div>
                 </div>
               </button>
             </div>
           </div>

           {/* Desktop: Horizontal tabs */}
           <TabsList
             className="hidden sm:flex w-full flex-nowrap overflow-x-auto gap-3 mb-8 bg-transparent border-none shadow-none px-0 scrollbar-thin scrollbar-thumb-accent/30"
             style={{
               WebkitOverflowScrolling: "touch",
               scrollbarWidth: "thin",
               scrollbarColor: "#bbf7d0 #f0fdf4",
             }}
           >
             <TabsTrigger
               value="recommendations"
               className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all min-w-[200px] sm:min-w-[220px]"
               style={{ flex: "0 0 auto" }}
               data-value="recommendations"
             >
               <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                 <Brain className="h-5 w-5 sm:h-6 sm:w-6" />
               </span>
               <span className="font-semibold text-xs sm:text-sm">Crop Recommendations</span>
             </TabsTrigger>
             <TabsTrigger
               value="predictions"
               className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all min-w-[180px] sm:min-w-[200px]"
               style={{ flex: "0 0 auto" }}
               data-value="predictions"
             >
               <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                 <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
               </span>
               <span className="text-xs sm:text-sm">Price Predictions</span>
             </TabsTrigger>
             <TabsTrigger
               value="detection"
               className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all min-w-[180px] sm:min-w-[200px]"
               style={{ flex: "0 0 auto" }}
               data-value="detection"
             >
               <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                 <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
               </span>
               <span className="text-xs sm:text-sm">Disease Detection</span>
             </TabsTrigger>
           </TabsList>

          {/* Crop Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get Crop Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (N) mg/kg</Label>
                    <input
                      type="number"
                      id="nitrogen"
                      value={cropFormData.nitrogen}
                      onChange={(e) => handleCropInputChange('nitrogen', e.target.value)}
                      placeholder="Enter Nitrogen (N)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorus">Phosphorus (P) mg/kg</Label>
                    <input
                      type="number"
                      id="phosphorus"
                      value={cropFormData.phosphorus}
                      onChange={(e) => handleCropInputChange('phosphorus', e.target.value)}
                      placeholder="Enter Phosphorus (P)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (K) mg/kg</Label>
                    <input
                      type="number"
                      id="potassium"
                      value={cropFormData.potassium}
                      onChange={(e) => handleCropInputChange('potassium', e.target.value)}
                      placeholder="Enter Potassium (K)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <input
                      type="number"
                      id="temperature"
                      value={cropFormData.temperature}
                      onChange={(e) => handleCropInputChange('temperature', e.target.value)}
                      placeholder="Enter Temperature (°C)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <input
                      type="number"
                      id="humidity"
                      value={cropFormData.humidity}
                      onChange={(e) => handleCropInputChange('humidity', e.target.value)}
                      placeholder="Enter Humidity (%)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">pH</Label>
                    <input
                      type="number"
                      id="ph"
                      value={cropFormData.ph}
                      onChange={(e) => handleCropInputChange('ph', e.target.value)}
                      placeholder="Enter pH"
                      step="0.1"
                      min="0"
                      max="14"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall (mm)</Label>
                    <input
                      type="number"
                      id="rainfall"
                      value={cropFormData.rainfall}
                      onChange={(e) => handleCropInputChange('rainfall', e.target.value)}
                      placeholder="Enter Rainfall (mm)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={getCropRecommendations}
                    disabled={cropLoading}
                  >
                    {cropLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Getting AI Recommendations...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFormData}
                      className="flex-1"
                    >
                      Clear Form
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Crop Recommendations</CardTitle>
                  <CardDescription>AI-powered suggestions based on your input</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cropError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{cropError}</p>
                    </div>
                  )}
                  
                  {cropLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">AI is analyzing your farm conditions...</p>
                        <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  ) : cropRecommendations ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold text-accent mb-2">AI Analysis Results:</h4>
                        <div className="bg-white p-4 rounded border text-sm leading-relaxed">
                          <ReactMarkdown>{cropRecommendations}</ReactMarkdown>
                        </div>
                      </div>
                      
                      {/* Crop Yield Probability Chart */}
                      {(() => {
                        const yieldCrops = extractYieldData(cropRecommendations);
                        console.log('AI Response:', cropRecommendations);
                        console.log('Extracted Yield Data:', yieldCrops);
                        
                        if (yieldCrops && yieldCrops.length > 0) {
                          return (
                            <div className="p-4 bg-white rounded border shadow-sm animate-fade-in-up">
                              <h5 className="font-semibold text-black-700 mb-3 text-left">Crop Yield Probability Analysis</h5>
                              <CropChart crops={yieldCrops} />
                              
                              {/* Best Crop Summary */}
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="font-semibold text-sm">
                                      Best Choice: {yieldCrops[0].name} ({yieldCrops[0].probability}% yield probability)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-4 bg-muted/30 rounded border text-center">
                              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Yield probability chart unavailable - yield data could not be extracted from AI response
                              </p>
                              <details className="mt-2 text-xs text-muted-foreground">
                                <summary className="cursor-pointer">Debug Info</summary>
                                <pre className="mt-2 text-left bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                                  {cropRecommendations.substring(0, 500)}...
                                </pre>
                              </details>
                            </div>
                          );
                        }
                      })()}
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setCropRecommendations("")}
                        className="w-full"
                      >
                        Clear Results
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-128 py-12">
                      <Brain className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                      <p className="text-muted-foreground mb-4 text-2xl font-semibold">No recommendations yet</p>
                      <p className="text-lg text-muted-foreground">
                        Fill in the form and click "Get AI Recommendations" to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Price Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Forecast</CardTitle>
                  <CardDescription>Select a crop to view price predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop">Select Crop</Label>
                    <Select onValueChange={setSelectedCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose crop for prediction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="jowar">Jowar</SelectItem>
                        <SelectItem value="bajra">Bajra</SelectItem>
                        <SelectItem value="tur">Tur</SelectItem>
                        <SelectItem value="moong">Moong</SelectItem>
                        <SelectItem value="urad">Urad</SelectItem>
                        <SelectItem value="soyabean">Soyabean</SelectItem>
                        <SelectItem value="groundnut">Groundnut</SelectItem>
                        <SelectItem value="sunflower">Sunflower</SelectItem>
                        <SelectItem value="onion">Onion</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                        <SelectItem value="tomato">Tomato</SelectItem>
                        <SelectItem value="chillies">Chillies</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pomegranate">Pomegranate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Select onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmednagar">Ahmednagar</SelectItem>
                        <SelectItem value="akola">Akola</SelectItem>
                        <SelectItem value="amravati">Amravati</SelectItem>
                        <SelectItem value="aurangabad">Aurangabad</SelectItem>
                        <SelectItem value="beed">Beed</SelectItem>
                        <SelectItem value="bhandara">Bhandara</SelectItem>
                        <SelectItem value="buldhana">Buldhana</SelectItem>
                        <SelectItem value="chandrapur">Chandrapur</SelectItem>
                        <SelectItem value="dhule">Dhule</SelectItem>
                        <SelectItem value="gadchiroli">Gadchiroli</SelectItem>
                        <SelectItem value="gondia">Gondia</SelectItem>
                        <SelectItem value="hingoli">Hingoli</SelectItem>
                        <SelectItem value="jalgaon">Jalgaon</SelectItem>
                        <SelectItem value="jalna">Jalna</SelectItem>
                        <SelectItem value="kolhapur">Kolhapur</SelectItem>
                        <SelectItem value="latur">Latur</SelectItem>
                        <SelectItem value="mumbai city">Mumbai City</SelectItem>
                        <SelectItem value="mumbai suburban">Mumbai Suburban</SelectItem>
                        <SelectItem value="nagpur">Nagpur</SelectItem>
                        <SelectItem value="nanded">Nanded</SelectItem>
                        <SelectItem value="nandurbar">Nandurbar</SelectItem>
                        <SelectItem value="nashik">Nashik</SelectItem>
                        <SelectItem value="osmanabad">Osmanabad</SelectItem>
                        <SelectItem value="parbhani">Parbhani</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="raigad">Raigad</SelectItem>
                        <SelectItem value="ratnagiri">Ratnagiri</SelectItem>
                        <SelectItem value="sangli">Sangli</SelectItem>
                        <SelectItem value="satara">Satara</SelectItem>
                        <SelectItem value="sindhudurg">Sindhudurg</SelectItem>
                        <SelectItem value="solapur">Solapur</SelectItem>
                        <SelectItem value="thane">Thane</SelectItem>
                        <SelectItem value="wardha">Wardha</SelectItem>
                        <SelectItem value="washim">Washim</SelectItem>
                        <SelectItem value="yavatmal">Yavatmal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={getPricePredictions}
                    disabled={priceLoading}
                  >
                    {priceLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating AI Forecast...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate AI Forecast
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearPricePredictions}
                    className="w-full"
                  >
                    Clear Form
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Price Predictions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {priceError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{priceError}</p>
                    </div>
                  )}
                  
                  {priceLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">AI is analyzing market trends...</p>
                        <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  ) : pricePredictions ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold text-accent mb-2">AI Market Analysis:</h4>
                        <div className="bg-white p-4 rounded border text-sm leading-relaxed">
                          <ReactMarkdown>{pricePredictions}</ReactMarkdown>
                        </div>
                      </div>
                      
                      {/* Price Chart */}
                      {(() => {
                        const { currentPrice, predictedPrice } = extractPriceData(pricePredictions)
                        if (currentPrice > 0 && predictedPrice > 0) {
                          return (
                            <div className="p-4 bg-white rounded border shadow-sm animate-fade-in-up">
                              <h5 className="font-semibold text-black-700 mb-3 text-left">Price Comparison Chart</h5>
                              <PriceChart 
                                currentPrice={currentPrice} 
                                predictedPrice={predictedPrice} 
                                crop={selectedCrop} 
                                district={selectedLocation} 
                              />
                              
                              {/* Price Summary */}
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div>
                                    <p className="text-sm text-gray-500">Price Difference</p>
                                    <p className={`text-lg font-bold ${
                                      predictedPrice > currentPrice ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      ₹{(predictedPrice - currentPrice).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Change %</p>
                                    <p className={`text-lg font-bold ${
                                      predictedPrice > currentPrice ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {((predictedPrice - currentPrice) / currentPrice * 100).toFixed(1)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div className="p-4 bg-muted/30 rounded border text-center">
                              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Chart unavailable - price data could not be extracted from AI response
                              </p>
                            </div>
                          )
                        }
                      })()}
                      

                      
                      <Button 
                        variant="outline" 
                        onClick={() => setPricePredictions("")}
                        className="w-full"
                      >
                        Clear Results
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No predictions yet</p>
                      <p className="text-sm text-muted-foreground">
                        Select crop and district, then click "Generate AI Forecast" to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Disease Detection Tab */}
          <TabsContent value="detection" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Crop Image</CardTitle>
                  <CardDescription>Take or upload a photo of your crop for AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-accent/20 rounded-lg p-8 text-center">
                    {showCamera ? (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          className="mx-auto rounded-lg max-h-64"
                          autoPlay
                          playsInline
                          style={{ width: "100%", maxWidth: 400, background: "#000" }}
                        />
                        <div className="flex justify-center gap-2">
                          <Button onClick={handleCapture}>
                            <Camera className="mr-2 h-4 w-4" />
                            Capture
                          </Button>
                          <Button variant="outline" onClick={() => setShowCamera(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : uploadedImage ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded crop"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <Button variant="outline" onClick={() => setUploadedImage(null)}>
                          Upload Different Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="h-12 w-12 text-accent mx-auto" />
                        <div>
                          <p className="text-sm font-medium">Upload crop image</p>
                          <p className="text-xs text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleTakePhoto}
                            className="hover:bg-black hover:text-white hover:border-black transition-all duration-300 bg-transparent"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-black hover:text-white hover:border-black transition-all duration-300 bg-transparent"
                          >
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </label>
                          </Button>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {uploadedImage && (
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={analyzeImageForDiseases}
                        disabled={diseaseLoading}
                      >
                        {diseaseLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing Image...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Analyze for Diseases
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearDiseaseAnalysis}
                        className="w-full"
                      >
                        Clear Image & Results
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Disease Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {diseaseError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{diseaseError}</p>
                    </div>
                  )}
                  
                  {diseaseLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">AI is analyzing your crop image...</p>
                        <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  ) : diseaseAnalysis ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold text-accent mb-2">AI Analysis Results:</h4>
                        <div className="bg-white p-4 rounded border text-sm leading-relaxed">
                          <ReactMarkdown>{diseaseAnalysis}</ReactMarkdown>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setDiseaseAnalysis("")}
                        className="w-full"
                      >
                        Clear Results
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No analysis results yet</p>
                      <p className="text-sm text-muted-foreground">
                        Upload or capture an image and click "Analyze for Diseases" to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </main>
  )
}

function LoginPrompt() {
  return (
    <main className="flex-1 bg-muted/30 pt-20">
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-10 w-10 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dashboard Access Required</h1>
                  <p className="text-muted-foreground text-lg">
                    Please log in to access your personalized farming dashboard and AI-powered features.
                  </p>
                </div>
              </div>

              <div className="space-y-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Brain className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">AI Crop Recommendations</p>
                      <p className="text-muted-foreground">Get personalized suggestions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">Price Predictions</p>
                      <p className="text-muted-foreground">Market forecasting tools</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">Disease Detection</p>
                      <p className="text-muted-foreground">AI-powered crop analysis</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-black hover:bg-gray-800 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" />
                      Login to Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-black hover:bg-gray-800 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <Link href="/register">Create Account</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-accent hover:underline font-medium">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsAuthenticated(!!user)
      
      // If user is authenticated, fetch their profile from users table
      if (user) {
        await fetchUserProfile(user.id)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
      
      // If user is authenticated, fetch their profile from users table
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Function to fetch user profile from users table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Floating farming elements */}
          <div className="absolute top-20 left-10 w-8 h-8 text-green-500/30 animate-float">
            <Sprout className="w-full h-full" />
          </div>
          <div
            className="absolute top-40 right-20 w-6 h-6 text-yellow-400/40 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <Sun className="w-full h-full" />
          </div>
          <div
            className="absolute top-60 left-1/4 w-5 h-5 text-blue-400/30 animate-float"
            style={{ animationDelay: "2s" }}
          >
            <Droplets className="w-full h-full" />
          </div>
          <div
            className="absolute bottom-40 right-1/3 w-7 h-7 text-green-400/25 animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <Wind className="w-full h-full" />
          </div>
          <div className="absolute bottom-20 left-10 w-10 h-10 text-green-600/20 animate-grow">
            <Leaf className="w-full h-full" />
          </div>

          {/* Additional farming animations */}
          <div
            className="absolute top-1/3 left-1/2 w-6 h-6 text-green-500/25 animate-bounce"
            style={{ animationDelay: "3s" }}
          >
            <Sprout className="w-full h-full" />
          </div>
          <div
            className="absolute bottom-1/3 right-10 w-8 h-8 text-yellow-500/30 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          >
            <Sun className="w-full h-full" />
          </div>
          <div
            className="absolute top-1/2 right-1/4 w-4 h-4 text-blue-500/35 animate-ping"
            style={{ animationDelay: "2.5s" }}
          >
            <Droplets className="w-full h-full" />
          </div>

          {/* Animated background gradients */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/3 rounded-full blur-2xl animate-float"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/3 to-green-400/3 rounded-full blur-3xl animate-spin-slow"></div>
          </div>
        </div>

        <Header />
        <main className="flex-1 bg-muted/30 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Floating farming elements */}
        <div className="absolute top-20 left-10 w-8 h-8 text-green-500/30 animate-float">
          <Sprout className="w-full h-full" />
        </div>
        <div
          className="absolute top-40 right-20 w-6 h-6 text-yellow-400/40 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Sun className="w-full h-full" />
        </div>
        <div
          className="absolute top-60 left-1/4 w-5 h-5 text-blue-400/30 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Droplets className="w-full h-full" />
        </div>
        <div
          className="absolute bottom-40 right-1/3 w-7 h-7 text-green-400/25 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <Wind className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 left-10 w-10 h-10 text-green-600/20 animate-grow">
          <Leaf className="w-full h-full" />
        </div>

        {/* Additional farming animations */}
        <div
          className="absolute top-1/3 left-1/2 w-6 h-6 text-green-500/25 animate-bounce"
          style={{ animationDelay: "3s" }}
        >
          <Sprout className="w-full h-full" />
        </div>
        <div
          className="absolute bottom-1/3 right-10 w-8 h-8 text-yellow-500/30 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        >
          <Sun className="w-full h-full" />
        </div>
        <div
          className="absolute top-1/2 right-1/4 w-4 h-4 text-blue-500/35 animate-ping"
          style={{ animationDelay: "2.5s" }}
        >
          <Droplets className="w-full h-full" />
        </div>

        {/* Animated background gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/3 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/3 to-green-400/3 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
      </div>

      <Header />

      {isAuthenticated ? <AuthProtectedDashboard user={user} userProfile={userProfile} /> : <LoginPrompt />}

      <Footer />
    </div>
  )
}
