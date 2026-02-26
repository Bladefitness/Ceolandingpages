import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Share2, Rocket } from "lucide-react";
import { Streamdown } from "streamdown";

export default function PublicRoadmap() {
  const { shareCode } = useParams<{ shareCode: string }>();
  
  const { data: roadmap, isLoading, error } = trpc.roadmap.getRoadmapByShareCode.useQuery(
    { shareCode: shareCode || "" },
    { enabled: !!shareCode }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--titan-background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--titan-blue)' }} />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--titan-background)' }}>
        <div className="text-center space-y-4">
          <h1 style={{ color: 'var(--titan-text-primary)', fontSize: '2rem', fontWeight: 'bold' }}>
            Roadmap Not Found
          </h1>
          <p style={{ color: 'var(--titan-text-muted)' }}>
            This roadmap link may have expired or doesn't exist.
          </p>
          <Link href="/">
            <Button
              style={{
                background: 'var(--titan-grad-primary)',
                color: 'var(--titan-background)',
              }}
            >
              Get Your Own Roadmap
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--titan-background)' }}>
      {/* Header */}
      <div 
        className="border-b"
        style={{ 
          background: 'var(--titan-white)',
          borderColor: 'var(--titan-border)'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 style={{ 
                color: 'var(--titan-text-primary)', 
                fontSize: 'var(--hpc-size-heading)', 
                fontWeight: 'var(--hpc-weight-bold)' 
              }}>
                {roadmap.businessName}
              </h1>
              <p style={{ color: 'var(--titan-text-muted)', fontSize: 'var(--titan-size-body-sm)' }}>
                {roadmap.businessType} • Scaling Roadmap
              </p>
            </div>
            <Link href="/">
              <Button
                style={{
                  background: 'var(--titan-grad-primary)',
                  color: 'var(--titan-background)',
                }}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Get Your Own Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Card
          className="p-4 sm:p-8 md:p-12"
          style={{
            background: 'var(--titan-white)',
            border: '1px solid var(--titan-border)',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <div 
            className="prose prose-invert max-w-none"
            style={{
              color: 'var(--titan-text-primary)',
              fontSize: 'var(--titan-size-body)',
              lineHeight: 'var(--titan-leading-relaxed)',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            <Streamdown>{(() => {
              // Handle edge case where titanRoadmap might be JSON stringified
              try {
                const parsed = JSON.parse(roadmap.titanRoadmap || '');
                // If it parses as JSON, it's malformed - return error message
                return 'This roadmap is being regenerated. Please check back in a few minutes.';
              } catch {
                // Not JSON - this is the correct format
                return roadmap.titanRoadmap || 'No roadmap content available.';
              }
            })()}</Streamdown>
          </div>
        </Card>

        {/* Viral CTA - Get Your Own Roadmap */}
        <div className="mt-12 mb-8">
          <Card
            className="p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #E5C158 0%, #f4d88a 100%)',
              border: 'none',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#0A0E1A' }}>
              Want Your Own Personalized Roadmap?
            </h2>
            <p className="text-base sm:text-lg mb-6" style={{ color: '#0A0E1A', opacity: 0.9 }}>
              Get your free bottleneck diagnosis + customized playbooks in under 3 minutes.
            </p>
            <Link href="/">
              <Button
                size="lg"
                style={{
                  background: '#0A0E1A',
                  color: '#E5C158',
                  fontSize: '1.125rem',
                  padding: '16px 32px',
                  fontWeight: 'bold',
                }}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get My Free Roadmap
              </Button>
            </Link>
            <p className="text-sm mt-4" style={{ color: '#0A0E1A', opacity: 0.7 }}>
              No credit card required • Requested by 5,000+ health professionals
            </p>
          </Card>
        </div>

        {/* Social Sharing */}
        <div className="mt-8 flex justify-center gap-3">
          <Button
            onClick={() => {
              const url = window.location.href;
              const text = `Check out my personalized scaling roadmap from Titan!`;
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
            }}
            variant="outline"
            style={{
              background: 'transparent',
              border: '1px solid var(--titan-border)',
              color: 'var(--titan-text-primary)',
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="ml-2 hidden sm:inline">LinkedIn</span>
          </Button>
          <Button
            onClick={() => {
              const url = window.location.href;
              const text = `Check out my personalized scaling roadmap! 🚀`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            }}
            variant="outline"
            style={{
              background: 'transparent',
              border: '1px solid var(--titan-border)',
              color: 'var(--titan-text-primary)',
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="ml-2 hidden sm:inline">Twitter</span>
          </Button>
          <Button
            onClick={() => {
              const url = window.location.href;
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            }}
            variant="outline"
            style={{
              background: 'transparent',
              border: '1px solid var(--titan-border)',
              color: 'var(--titan-text-primary)',
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="ml-2 hidden sm:inline">Facebook</span>
          </Button>
        </div>

        {/* Community & Booking CTAs */}
        <div className="mt-12 mb-8">
          <Card
            className="p-8 text-center"
            style={{
              background: 'var(--titan-white)',
              border: '1px solid var(--titan-border)',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: 'var(--titan-text-primary)' }}
            >
              Ready to Accelerate Your Growth?
            </h2>
            <p
              className="text-base sm:text-lg mb-8"
              style={{ color: 'var(--titan-text-secondary)', maxWidth: '520px', margin: '0 auto 2rem' }}
            >
              Join a community of health business owners scaling past $10K — or book a free call to map out your next move.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://skool.com/10ksidehustle/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'var(--titan-grad-primary)',
                  color: 'var(--titan-background)',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
                Join Health Pro CEO Community (Free)
              </a>
              <a
                href="https://demo.doctorleadflow.com/booking"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  color: 'var(--titan-blue)',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  border: '2px solid var(--titan-blue)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book a Free Strategy Call
              </a>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center space-y-6">
          <h2 style={{ 
            color: 'var(--titan-text-primary)', 
            fontSize: '2rem', 
            fontWeight: 'bold' 
          }}>
            Want Your Own Personalized Roadmap?
          </h2>
          
          <p style={{ 
            color: 'var(--titan-text-secondary)', 
            fontSize: '1.125rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Get your free personalized roadmap showing exactly what to fix, what to focus on, 
            and what to ignore to break through your current revenue plateau.
          </p>
          
          <Link href="/">
            <Button
              size="lg"
              style={{
                background: 'var(--titan-grad-primary)',
                color: 'var(--titan-background)',
                fontSize: '1.125rem',
                padding: '1.5rem 3rem',
              }}
            >
              Get my roadmap →
            </Button>
          </Link>
          
          <p style={{ 
            color: 'var(--titan-blue)', 
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '1rem'
          }}>
            Our strategies have generated $1.5M+ in tracked client results.
          </p>
          
          <p style={{ 
            color: 'var(--titan-text-muted)', 
            fontSize: '0.875rem' 
          }}>
            No credit card required • Under 3 minutes • Requested by 5,000+ health professionals
          </p>
        </div>
      </div>
    </div>
  );
}
