import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkIcon, Zap, Shield, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ShortLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Shorten Your URLs with{" "}
            <span className="text-blue-600">Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create short, memorable links that are perfect for social media,
            email campaigns, and more. Track clicks and analyze your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Shortening
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose ShortLink?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers powerful features to help you manage and track
            your shortened URLs effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate short links instantly with our optimized infrastructure
                and global CDN.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your links are protected with enterprise-grade security and
                99.9% uptime guarantee.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track clicks, analyze traffic sources, and understand your
                audience with comprehensive analytics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <LinkIcon className="h-6 w-6" />
            <span className="text-xl font-bold">ShortLink</span>
          </div>
          <p className="text-gray-400">
            © 2024 ShortLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
