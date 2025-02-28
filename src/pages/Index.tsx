
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, BarChart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <div className="inline-block animate-fade-in">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  AI-Powered Scheduling
                </span>
              </div>
              
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
                Effortlessly Create Perfect Timetables
              </h1>
              
              <p className="mt-6 text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '100ms' }}>
                Generate optimized school and college timetables in minutes with our intelligent
                AI system. Save hours of manual work.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link to="/generator">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Your Timetable
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/20 rounded-2xl overflow-hidden shadow-glass">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="w-full max-w-md glass p-4 rounded-xl">
                    <div className="grid grid-cols-6 gap-1">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 p-1 text-center text-xs font-medium">Mon</div>
                      <div className="col-span-1 p-1 text-center text-xs font-medium">Tue</div>
                      <div className="col-span-1 p-1 text-center text-xs font-medium">Wed</div>
                      <div className="col-span-1 p-1 text-center text-xs font-medium">Thu</div>
                      <div className="col-span-1 p-1 text-center text-xs font-medium">Fri</div>
                      
                      {[9, 10, 11, 12, 13, 14].map((hour) => (
                        <React.Fragment key={hour}>
                          <div className="col-span-1 p-1 text-center text-xs">
                            {hour}:00
                          </div>
                          {[1, 2, 3, 4, 5].map((day) => (
                            <div 
                              key={`${hour}-${day}`} 
                              className={`col-span-1 p-1 ${Math.random() > 0.5 ? 'bg-primary/10 rounded' : ''}`}
                            >
                              {Math.random() > 0.7 && (
                                <div className="text-[0.65rem] opacity-70 text-center">Class</div>
                              )}
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Our timetable generator comes packed with everything you need to create perfect schedules.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar className="w-10 h-10 text-primary" />,
                title: "AI-Generated Options",
                description: "Our AI creates multiple optimized timetable options based on your constraints."
              },
              {
                icon: <Clock className="w-10 h-10 text-primary" />,
                title: "Drag & Drop Editing",
                description: "Easily modify your timetable by dragging and dropping classes to different time slots."
              },
              {
                icon: <BarChart className="w-10 h-10 text-primary" />,
                title: "Smart Constraints",
                description: "Set faculty preferences, room assignments, and more for better scheduling."
              },
              {
                icon: <Download className="w-10 h-10 text-primary" />,
                title: "Export Options",
                description: "Export your finished timetable as an Excel sheet or PDF for easy sharing."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="glass p-6 rounded-xl hover:scale-[1.03] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Streamline Your Scheduling?</h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Join thousands of educational institutions that save time and reduce stress with our timetable generator.
          </p>
          <div className="mt-10">
            <Link to="/generator">
              <Button size="lg" className="rounded-lg px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
