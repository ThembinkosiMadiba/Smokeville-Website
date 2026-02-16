import { Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function CareersPage() {
  const jobOpenings = [
    {
      title: 'Head Chef',
      type: 'Full-time',
      location: 'Cape Town',
      description:
        'Lead our culinary team and create innovative dishes that showcase the best of flame-grilled cuisine.',
    },
    {
      title: 'Grill Master',
      type: 'Full-time',
      location: 'Cape Town',
      description:
        'Expert in smoke and fire cooking techniques. Manage our signature grill station.',
    },
    {
      title: 'Sommelier',
      type: 'Full-time',
      location: 'Cape Town',
      description:
        'Curate our wine collection and guide guests through memorable beverage pairings.',
    },
    {
      title: 'Waitstaff',
      type: 'Part-time',
      location: 'Cape Town',
      description:
        'Deliver exceptional service and create unforgettable dining experiences for our guests.',
    },
    {
      title: 'Bartender',
      type: 'Full-time',
      location: 'Cape Town',
      description:
        'Craft creative cocktails and manage our bar with expertise and flair.',
    },
  ];

  const teamImages = [
    'https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1594266063697-304befca9629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwcmlicyUyMHNtb2tlfGVufDF8fHx8MTc2MDcwMDQwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1620818309871-6255570324d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGRhcmt8ZW58MXx8fHwxNzYwNzAwNDA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1653205580794-309d27d8c1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGFyayUyMGVsZWdhbnR8ZW58MXx8fHwxNzYwNzAwNDA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/60 to-[#121212]" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl mb-4 text-[#F5F5F5]">
            Join the Family that Masters the Flame
          </h1>
          <p className="text-xl text-[#CBA135] max-w-2xl mx-auto">
            Build your career in a place where passion meets perfection
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-12 text-center text-[#CBA135]">
            Why Work at <span className="smokeville-logo">SMOKEVILLE</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full mx-auto mb-4 flex items-center justify-center text-[#121212] text-2xl">
                🎓
              </div>
              <h3 className="text-xl mb-3 text-[#F5F5F5]">Growth & Learning</h3>
              <p className="text-[#F5F5F5]/60">
                Train under award-winning chefs and master new culinary techniques
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full mx-auto mb-4 flex items-center justify-center text-[#121212] text-2xl">
                🤝
              </div>
              <h3 className="text-xl mb-3 text-[#F5F5F5]">Team Culture</h3>
              <p className="text-[#F5F5F5]/60">
                Be part of a supportive, diverse team that feels like family
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full mx-auto mb-4 flex items-center justify-center text-[#121212] text-2xl">
                💎
              </div>
              <h3 className="text-xl mb-3 text-[#F5F5F5]">Benefits</h3>
              <p className="text-[#F5F5F5]/60">
                Competitive salary, health benefits, and staff meals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team at Work */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-12 text-center text-[#CBA135]">
            Our Team at Work
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl overflow-hidden group"
              >
                <ImageWithFallback
                  src={image}
                  alt={`Team member ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl mb-12 text-center text-[#CBA135]">
            Current Openings
          </h2>

          <div className="space-y-4">
            {jobOpenings.map((job, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-2xl p-6 hover:ring-2 hover:ring-[#CBA135]/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-2 text-[#F5F5F5]">{job.title}</h3>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="border-[#CBA135]/30 text-[#CBA135]"
                      >
                        <Briefcase className="w-3 h-3 mr-1" />
                        {job.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[#CBA135]/30 text-[#F5F5F5]/80"
                      >
                        {job.location}
                      </Badge>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] md:w-auto">
                    Apply Now
                  </Button>
                </div>
                <p className="text-[#F5F5F5]/70">{job.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact HR */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl mb-4 text-[#CBA135]">Don't See Your Role?</h2>
          <p className="text-[#F5F5F5]/80 mb-8">
            We're always looking for talented individuals. Send us your CV and 
            let us know how you'd like to contribute to the <span className="smokeville-logo text-[#CBA135]">SMOKEVILLE</span> family.
          </p>
          <div className="space-y-2">
            <p className="text-[#F5F5F5]">Email: careers@smokeville.co.za</p>
            <p className="text-[#F5F5F5]/60 text-sm">
              Please include "Application - [Position]" in your subject line
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
