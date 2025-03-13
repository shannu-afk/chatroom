import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                The next generation<br />chat platform
              </h1>
              <p className="text-lg mb-8 text-primary-50 max-w-lg">
                Connect with friends and colleagues in real-time with our clean, intuitive interface designed for seamless communication.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/register">
                  <Button size="lg" className="bg-secondary hover:bg-secondary-500 text-white">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <Card className="shadow-lg border border-neutral">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </div>
                        <span className="font-semibold">Public Chat</span>
                      </div>
                      <div className="text-sm text-primary-500">Online</div>
                    </div>
                    
                    {/* Chat messages preview */}
                    <div className="space-y-4 mb-4">
                      {/* Sample message 1 */}
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-white">S</div>
                        <div className="ml-2">
                          <div className="flex items-baseline">
                            <span className="font-medium text-sm">Sarah</span>
                            <span className="ml-2 text-xs text-primary-500">10:23 AM</span>
                          </div>
                          <div className="bg-neutral p-3 rounded-lg rounded-tl-none mt-1 text-sm max-w-xs">
                            Has anyone tried the new messaging features yet?
                          </div>
                        </div>
                      </div>
                      
                      {/* Sample message 2 */}
                      <div className="flex items-start justify-end">
                        <div className="mr-2">
                          <div className="flex items-baseline justify-end">
                            <span className="mr-2 text-xs text-primary-500">10:24 AM</span>
                            <span className="font-medium text-sm">John</span>
                          </div>
                          <div className="bg-secondary text-white p-3 rounded-lg rounded-tr-none mt-1 text-sm max-w-xs">
                            Yes! The new UI is amazing. I love how intuitive everything feels.
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white">J</div>
                      </div>
                      
                      {/* Sample message 3 */}
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-white">M</div>
                        <div className="ml-2">
                          <div className="flex items-baseline">
                            <span className="font-medium text-sm">Mark</span>
                            <span className="ml-2 text-xs text-primary-500">10:26 AM</span>
                          </div>
                          <div className="bg-neutral p-3 rounded-lg rounded-tl-none mt-1 text-sm max-w-xs">
                            Can't wait to join this conversation!
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat input */}
                    <div className="relative">
                      <div className="w-full p-3 pr-12 border border-neutral rounded-md text-sm bg-gray-100 text-gray-500">
                        Login to start chatting...
                      </div>
                      <button disabled className="absolute right-3 top-3 text-secondary opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </CardContent>
                </Card>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full -z-10"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/10 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Chat?</h2>
            <p className="text-primary-500 max-w-2xl mx-auto">Our platform combines the best chat features with a modern, intuitive interface designed for seamless communication.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background p-6 rounded-lg border border-neutral">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Messaging</h3>
              <p className="text-primary-500">Instantly connect with others with our lightning-fast messaging system.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-background p-6 rounded-lg border border-neutral">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-accent" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Communication</h3>
              <p className="text-primary-500">Your conversations are kept secure, giving you peace of mind while chatting.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-background p-6 rounded-lg border border-neutral">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Public Chatrooms</h3>
              <p className="text-primary-500">Create or join public chatrooms to discuss topics with others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start chatting?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/80">Join now and start communicating with people from around the world.</p>
          <Link href="/register">
            <Button size="lg" className="bg-secondary hover:bg-secondary-500 text-white">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
