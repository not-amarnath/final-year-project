"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Upload,
  ImageIcon,
  User,
  Trash2,
  Edit,
  Camera,
  CameraOff,
  Play,
  Square,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useState, useRef,useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import * as faceapi from 'face-api.js';
export default function AuthorizedPersonsPage() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraState, setCameraState] = useState<"off" | "starting" | "active" | "error">("off")
  const [recognitionActive, setRecognitionActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [detectedFaces, setDetectedFaces] = useState<
    Array<{
      id: string
      name: string
      confidence: number
      isAuthorized: boolean
      boundingBox: { x: number; y: number; width: number; height: number }
    }>
  >([])
  const [recognitionResults, setRecognitionResults] = useState<
    Array<{
      timestamp: string
      name: string
      confidence: number
      isAuthorized: boolean
      image: string
    }>
  >([])

  // Form state
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [authorizedPersons, setAuthorizedPersons] = useState<Array<{
    id: number;
    name: string;
    imageUrl: string;
    faceDescriptor: Float32Array | string;
  }>>([
    
  ]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("Face-api models loaded successfully");
        toast({ title: "System Ready", description: "Face recognition models loaded." });
      } catch (error) {
        console.error("Error loading face-api models:", error);
        toast({ title: "Model Load Error", description: "Could not load face recognition models.", variant: "destructive" });
      }
    };
    loadModels();
  }, [toast]);

  const startCamera = useCallback(async () => {
    if (cameraState === "starting" || cameraState === "active") {
      console.log("  Camera already starting or active")
      return
    }

    console.log("  Starting camera...")
    setCameraState("starting")
    setErrorMessage("")

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera not supported in this browser")
      }

      console.log("  Requesting camera access...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      console.log("  Camera stream obtained successfully")

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream

        videoRef.current.onloadedmetadata = async () => {
          try {
            console.log("  Video metadata loaded, starting playback...")
            if (videoRef.current) {
              await videoRef.current.play()
              console.log("  Video playing successfully, setting state to active")
              setCameraState("active")

              toast({
                title: "Camera Started",
                description: "Camera is now active for face recognition.",
                variant: "default",
              })
            }
          } catch (playError) {
            console.error("  Video play error:", playError)
            setCameraState("error")
            setErrorMessage("Failed to start video playback")
          }
        }

        videoRef.current.onerror = (error) => {
          console.error("  Video error:", error)
          setCameraState("error")
          setErrorMessage("Video loading failed")
        }

        stream.getTracks().forEach((track) => {
          track.addEventListener("ended", () => {
            console.log("  Camera track ended")
            setCameraState("error")
            setErrorMessage("Camera was disconnected")
            stopRecognition()
          })
        })
      } else {
        throw new Error("Video element not available")
      }
    } catch (error) {
      console.error("  Camera error:", error)
      setCameraState("error")

      let errorMsg = "Failed to access camera"
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMsg = "Camera permission denied. Please allow camera access."
        } else if (error.name === "NotFoundError") {
          errorMsg = "No camera found on this device."
        } else if (error.name === "NotReadableError") {
          errorMsg = "Camera is being used by another application."
        } else {
          errorMsg = error.message
        }
      }

      setErrorMessage(errorMsg)
      toast({
        title: "Camera Error",
        description: errorMsg,
        variant: "destructive",
      })
    }
  }, [cameraState, toast])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraState("off")
    setErrorMessage("")
    stopRecognition()

    toast({
      title: "Camera Stopped",
      description: "Camera has been turned off.",
      variant: "default",
    })
  }, [toast])

  const performFaceRecognition = useCallback(async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      cameraState !== "active" ||
      !modelsLoaded ||
      authorizedPersons.length === 0
    ) {
      return;
    }

    const video = videoRef.current;
    if (video.readyState !== 4) return;

    // Create a FaceMatcher from our authorized persons' data
    const labeledFaceDescriptors = authorizedPersons
      .filter(p => p.faceDescriptor instanceof Float32Array)
      .map(p => new faceapi.LabeledFaceDescriptors(p.name, [p.faceDescriptor as Float32Array]));

    if (labeledFaceDescriptors.length === 0) {
        setDetectedFaces([]); // No one is enrolled yet
        return;
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5); // Adjust threshold (0.6 is stricter)

    // Perform detection
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors();
console.log("Detection attempt returned:", detections);
    if (detections.length > 0) {
      const results = detections.map(d => {
        const bestMatch = faceMatcher.findBestMatch(d.descriptor);
        return {
          id: `face_${Date.now()}_${Math.random()}`,
          name: bestMatch.label,
          confidence: bestMatch.distance, // Lower is better
          isAuthorized: bestMatch.label !== "unknown",
          boundingBox: d.detection.box,
        };
      });

      setDetectedFaces(results);

      const bestResult = results.reduce((prev, curr) => (prev.confidence < curr.confidence ? prev : curr));
      if (bestResult.confidence < 0.55) { 
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          const imageData = canvas.toDataURL("image/jpeg", 0.8);

          setRecognitionResults((prev) => [
            {
              timestamp: new Date().toLocaleTimeString(),
              name: bestResult.name,
              confidence: 1 - bestResult.confidence, // Invert distance to show as confidence %
              isAuthorized: bestResult.isAuthorized,
              image: imageData,
            },
            ...prev.slice(0, 9),
          ]);
      }
      
    } else {
      setDetectedFaces([]);
    }
  }, [cameraState, modelsLoaded, authorizedPersons]);

  const startRecognition = useCallback(() => {
    if (cameraState !== "active") {
      toast({
        title: "Camera Required",
        description: "Please start the camera first.",
        variant: "destructive",
      })
      return
    }

    setRecognitionActive(true)
    recognitionIntervalRef.current = setInterval(performFaceRecognition, 2000)

    toast({
      title: "Recognition Started",
      description: "Face recognition is now active.",
      variant: "default",
    })
  }, [cameraState, performFaceRecognition, toast])

  const stopRecognition = useCallback(() => {
    setRecognitionActive(false)
    setDetectedFaces([])

    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current)
      recognitionIntervalRef.current = null
    }

    toast({
      title: "Recognition Stopped",
      description: "Face recognition has been stopped.",
      variant: "default",
    })
  }, [toast])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImageFile(null)
      setImagePreview(null)
    }
  }

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !imageFile) {
      toast({ title: "Missing Information", description: "Please provide both name and an image.", variant: "destructive" });
      return;
    }
    if (!modelsLoaded) {
      toast({ title: "System Not Ready", description: "Face recognition models are still loading.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Convert uploaded file to an HTML image element
      const image = await faceapi.bufferToImage(imageFile);

      // 2. Detect face and compute the real descriptor
      const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

      if (!detection) {
        toast({ title: "Detection Failed", description: "No face could be detected in the uploaded image.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // This is the REAL face data
      const descriptor = detection.descriptor;

      // You can optionally still call your backend here if needed
      // await uploadAuthorizedPerson(name, imageFile); 

      const newPerson = {
        id: Date.now(),
        name: name,
        imageUrl: imagePreview || "/placeholder.svg",
        faceDescriptor: descriptor, // <-- STORE THE REAL DESCRIPTOR
      };

      setAuthorizedPersons((prev) => [...prev, newPerson]);

      // Reset form
      setName("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({ title: "Person Added", description: `${name} has been added successfully.` });
    } catch (error) {
      console.error("Upload/Processing failed:", error);
      toast({ title: "Error", description: "An error occurred while processing the image.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePerson = (personId: number) => {
    setAuthorizedPersons((prev) => prev.filter((person) => person.id !== personId))
    toast({
      title: "Person Removed",
      description: "Authorized person has been removed from the system.",
      variant: "default",
    })
  }

  // const calculateAverageBrightness = (imageData: ImageData) => {
  //   let totalBrightness = 0
  //   const data = imageData.data
  //   const sampleSize = Math.min(10000, data.length / 4) // Sample pixels for performance

  //   for (let i = 0; i < sampleSize * 4; i += 16) {
  //     // Sample every 4th pixel
  //     const r = data[i]
  //     const g = data[i + 1]
  //     const b = data[i + 2]
  //     totalBrightness += (r + g + b) / 3
  //   }

  //   return totalBrightness / sampleSize
  // }

  // const detectMovement = (imageData: ImageData) => {
  //   const movementChance = Math.random()
  //   return movementChance > 0.3 // 70% chance of detecting movement
  // }

  // const performFaceMatching = (imageData: ImageData, persons: typeof authorizedPersons) => {
  //   if (persons.length === 0) {
  //     return {
  //       name: "Unknown Person",
  //       confidence: Math.random() * 0.35 + 0.35, // 0.35 to 0.70 confidence
  //       isAuthorized: false,
  //     }
  //   }

    

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Energy Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Authorized Persons</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Live Camera Feed
              </CardTitle>
              <CardDescription>Monitor live camera feed for face recognition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${cameraState === "active" ? "block" : "hidden"}`}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {cameraState === "active" &&
                    detectedFaces.map((face) => (
                      <div
                        key={face.id}
                        className={`absolute border-2 ${face.isAuthorized ? "border-green-500 bg-green-500/20" : "border-red-500 bg-red-500/20"}`}
                        style={{
                          left: `${(face.boundingBox.x / (videoRef.current?.videoWidth || 640)) * 100}%`,
                          top: `${(face.boundingBox.y / (videoRef.current?.videoHeight || 480)) * 100}%`,
                          width: `${(face.boundingBox.width / (videoRef.current?.videoWidth || 640)) * 100}%`,
                          height: `${(face.boundingBox.height / (videoRef.current?.videoHeight || 480)) * 100}%`,
                        }}
                      >
                        <div
                          className={`absolute -top-8 left-0 ${face.isAuthorized ? "bg-green-500" : "bg-red-500"} text-white px-2 py-1 rounded text-xs whitespace-nowrap`}
                        >
                          {face.name} ({Math.round(face.confidence * 100)}%)
                        </div>
                      </div>
                    ))}

                  {cameraState !== "active" && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                      <div className="text-center">
                        <CameraOff className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-medium">
                          {cameraState === "starting"
                            ? "Starting camera..."
                            : cameraState === "error"
                              ? "Camera error"
                              : "Camera is off"}
                        </p>
                        {errorMessage && <p className="text-red-500 text-sm mt-2 max-w-xs">{errorMessage}</p>}
                        {cameraState === "off" && <p className="text-green-600 text-sm mt-1">Ready to start</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {cameraState !== "active" ? (
                    <Button onClick={startCamera} className="flex-1" disabled={cameraState === "starting"}>
                      <Camera className="h-4 w-4 mr-2" />
                      {cameraState === "starting" ? "Starting..." : "Start Camera"}
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                      <CameraOff className="h-4 w-4 mr-2" />
                      Stop Camera
                    </Button>
                  )}

                  {cameraState === "active" &&
                    (!recognitionActive ? (
                      <Button onClick={startRecognition} className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Start Recognition
                      </Button>
                    ) : (
                      <Button onClick={stopRecognition} variant="outline" className="flex-1 bg-transparent">
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recognition
                      </Button>
                    ))}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${recognitionActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                    />
                    <span className="text-sm font-medium">
                      Recognition: {recognitionActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Badge variant={detectedFaces.length > 0 ? "default" : "secondary"}>
                    {detectedFaces.length} face(s) detected
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recognition Results
              </CardTitle>
              <CardDescription>Recent face recognition results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recognitionResults.length > 0 ? (
                  recognitionResults.map((result, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img
                        src={result.image || "/placeholder.svg?height=48&width=48&query=detected face"}
                        alt="Detected face"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {result.isAuthorized ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{result.name}</span>
                          <Badge variant={result.isAuthorized ? "default" : "destructive"}>
                            {result.isAuthorized ? "Authorized" : "Unauthorized"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {result.timestamp} • {Math.round(result.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recognition results yet</p>
                    <p className="text-xs">Start camera and recognition to see results</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Authorized Person</CardTitle>
            <CardDescription>Upload a new authorized person for surveillance system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="personName">Person Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="personName"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="personImage">Person Image</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="personImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="flex-1"
                    required
                  />
                  {imagePreview && (
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Image Preview" />
                      <AvatarFallback>
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" /> Upload Person
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Authorized Persons ({authorizedPersons.length})</CardTitle>
            <CardDescription>Manage your list of authorized individuals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {authorizedPersons.map((person) => (
                <Card key={person.id} className="flex items-center p-4 space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={person.imageUrl || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">Authorized</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Face data: Ready
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => handleDeletePerson(person.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
