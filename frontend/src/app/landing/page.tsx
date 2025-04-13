import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpCircle, ArrowRight, CheckCircle, Zap, Shield, BarChart3 } from "lucide-react"
import { MobilePreview } from "@/components/mobile-preview"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded bg-white overflow-hidden">
            <Image
              src="/logo.png"
              alt="Omnivia logo"
              fill
              className="object-contain invert dark:invert-0"
              sizes="80%"
            />
            </div>
            <span className="text-xl font-bold">Omnivia</span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Make smarter decisions <br />
                  <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
                    with AI-powered insights
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                Omnivia analyzes your goals and real-time market data to help you make better decisions about major
                  life choices.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/signup">
                  <Button className="px-6 py-3 h-auto rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free tier available</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <MobilePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why choose Omnivia?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform helps you make better decisions by analyzing multiple factors and providing
              data-backed recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-10 w-10 text-purple-500" />,
                title: "Real-time Market Data",
                description:
                  "Access up-to-date information from financial markets, real estate trends, job markets, and more.",
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-cyan-500" />,
                title: "Personalized Analysis",
                description: "Get recommendations tailored to your specific goals, risk tolerance, and timeline.",
              },
              {
                icon: <Shield className="h-10 w-10 text-green-500" />,
                title: "Private & Secure",
                description: "Your data is encrypted and never shared. We prioritize your privacy and security.",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Omnivia Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI system breaks down complex decisions into manageable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Ask Your Question",
                description:
                  "Start by asking about any major decision you're facing, like buying a home or changing careers.",
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI analyzes your goals, current market conditions, and potential tradeoffs.",
              },
              {
                step: "03",
                title: "Get Recommendations",
                description: "Receive a detailed report with a clear verdict, confidence score, and actionable advice.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-4xl font-bold text-purple-500/20 mb-2">{step.step}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works for you. All plans include core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for trying out Omnivia",
                features: ["5 decisions per month", "Basic market data", "7-day decision history"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "per month",
                description: "For individuals making important decisions",
                features: [
                  "Unlimited decisions",
                  "Advanced market data",
                  "Unlimited decision history",
                  "Priority support",
                  "Export reports",
                ],
                cta: "Start 7-day Trial",
                popular: true,
              },
              {
                name: "Team",
                price: "$29.99",
                period: "per month",
                description: "For teams and businesses",
                features: [
                  "Everything in Pro",
                  "5 team members",
                  "Collaborative decisions",
                  "Team analytics",
                  "API access",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`bg-background rounded-xl p-6 border shadow-sm ${
                  plan.popular ? "border-purple-500 shadow-md relative" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-xl font-bold mb-2">{plan.name}</div>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to make better decisions?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of users who trust Omnivia for their most important life choices.
            </p>
            <Link href="/auth/signup">
              <Button className="px-6 py-3 h-auto rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Omnivia</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered decision assistant for life's biggest choices.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
          Omnivia © {new Date().getFullYear()} - Your personal decision-making assistant
          </div>
        </div>
      </footer>
    </div>
  )
}
