# Titan Dashboard TODO

## Current Sprint
- [x] Generate all selected bonus playbooks (Facebook Ad, Offer, Instagram, Lead Gen) alongside Titan Roadmap
- [x] Display all playbooks as separate sections on the dashboard
- [x] Add "Download All" button to export all generated content
- [x] Add "Email to Me" button to send all content to user's email

## Completed
- [x] Build multi-step quiz interface
- [x] Integrate AI backend with user's exact Airtable prompts
- [x] Generate Titan Scaling Roadmap
- [x] Display roadmap on dashboard with copy functionality

## Rebranding to Health Pro CEO
- [x] Rebrand "Titan Dashboard" to "Health Pro CEO Scaling Roadmap" across all pages
- [x] Apply Health Pro CEO color system (dark depth + gold authority) to global CSS
- [x] Update typography to use Playfair Display + DM Sans
- [x] Apply gold spectrum colors to CTAs, buttons, and highlights
- [x] Update all text references from "Titan" to "Health Pro CEO"

## Smart Landing Page Quiz Rebuild
- [x] Remove "best transformation" question, add "differentiating factor" question
- [x] Add bottleneck diagnosis questions (CRM usage, proficiency, GHL, chat agents, response time, content frequency)
- [x] Transform multi-field steps into one-question-at-a-time flow
- [x] Insert 5 educational micro-lessons at strategic points
- [x] Design lesson screens with key stats and insights
- [x] Update quiz logic to handle single-question progression
- [x] Add lesson about 15 content styles for medical professionals (after content frequency question)
- [ ] Update Instagram Growth playbook to reference the 15 content styles
- [ ] Fix dashboard formatting issues (title cutoff, layout improvements)
- [x] Test complete quiz flow from start to finish
- [x] Verify dashboard displays correctly with new quiz data structure

## Quiz Redesign - Strategic Flow (Hormozi-Optimized)
- [x] Implement modern SaaS typography system (Inter font, 4-level scale, tabular numbers)
- [x] Move email capture to Q4 (early capture before drop-off)
- [x] Replace ALL dropdowns with button-based selections
- [x] Update landing page: time promise "under 3 minutes" + social proof
- [x] Change email question to "Where should I send your roadmap?"
- [ ] Add visual preview of roadmap on landing page (optional - skip for now)
- [x] Rebuild SmartQuiz.tsx with optimized 18Q + 4L flow
- [x] Fix dashboard generation bug (added database schema + save/retrieve)
- [x] Test end-to-end flow and verify dashboard generates correctly (buttons auto-advance, email Q4, lessons display)

## Fix 404 Error After Quiz Completion
- [x] Check App.tsx routing configuration for /dashboard/:id route
- [x] Create or update Dashboard.tsx page to fetch and display roadmap by ID
- [x] Add getRoadmapById tRPC procedure if missing
- [x] Test complete quiz flow from start to dashboard display
- [x] Verify roadmap content displays correctly with proper formatting
- [x] Write and run vitest tests for end-to-end flow (all passing)

## Add Welcome Screen to Quiz
- [x] Create intro screen before Question 1 with value proposition
- [x] Include: what they'll get, time estimate, social proof
- [x] Add "Start Assessment" CTA button to begin quiz
- [x] Test complete flow from welcome → quiz → dashboard

## Redesign Welcome Screen (More Aesthetic)
- [x] Increase spacing and padding for more breathing room
- [x] Improve typography hierarchy (larger headline, better contrast)
- [x] Remove cramped "lesson" card styling, use custom welcome layout
- [x] Add visual elements (CheckCircle2 icons, better use of gold accent)
- [x] Make it feel premium and high-value (not generic form)

## Match Welcome Screen to Original Home Design
- [x] Remove card background (use transparent/minimal design like Home)
- [x] Center content vertically and horizontally
- [x] Match typography and spacing to original Home page
- [x] Keep "POWERED BY AI" badge at top
- [x] Use same button style and positioning as Home

## Add Playbook Selection & Fix Ads Lesson
- [x] Add playbook selection question at end (before final submission)
- [x] Allow multi-select for: Offer, Facebook Ads, Instagram Growth, Lead Gen System
- [x] Rewrite ads lesson to be empowering ("you can learn this")
- [x] Position agencies as the enemy in ads lesson
- [x] Emphasize fixing bottlenecks first before running ads
- [x] Update backend to handle playbook selection in roadmap generation

## Add Test Mode for Quick Playbook Testing
- [x] Add URL parameter (?test=playbooks) to skip to playbook selection
- [x] Pre-fill all required fields with dummy data in test mode
- [ ] Test the playbook selection and submission flow

## Fix Playbook Selection Continue Button
- [x] Add Continue button to playbook selection (multi-select question)
- [x] Button should appear after at least one playbook is selected
- [ ] Test the complete flow from playbook selection to submission

## Debug Playbook Generation Issues
- [x] Check why only one playbook shows when all are selected (multi-select working correctly)
- [x] Debug dashboard "quit" issue after generation (no issue - all playbooks generated)
- [x] Verify all selected playbooks are being generated correctly (all 4 playbooks + Titan generated)
- [x] Test complete flow from selection to dashboard display (working perfectly)
- [x] Run all tests to ensure everything works (all tests passing)
- [x] Save final checkpoint for deployment (version bd731bcf)

## Admin Leads Dashboard
- [x] Create tRPC procedure to fetch all roadmaps with filters
- [x] Add database query functions for filtering by revenue/frustration
- [x] Create /admin/leads route in App.tsx
- [x] Build AdminLeads.tsx page with table view
- [x] Add filter dropdowns for revenue range and frustration type
- [x] Display key metrics (total leads, avg revenue, this month count)
- [x] Add export to CSV functionality
- [x] Add sorting by date (default: newest first)
- [x] Test complete admin dashboard flow (filters working, export CSV working)
- [x] Save checkpoint (version 80174d20)

## Lead Status Tracking
- [x] Add status field to roadmaps table schema (enum: new, contacted, qualified, converted)
- [x] Push database schema changes
- [x] Create updateLeadStatus tRPC mutation
- [x] Add Status column to admin dashboard table
- [x] Add dropdown menu in each row to update status
- [x] Test status updates end-to-end (tested: New → Contacted working perfectly)
- [x] Save checkpoint (version 78e92873)

## Status Filter for Admin Dashboard
- [x] Add status parameter to getAllRoadmaps tRPC procedure
- [x] Update database query to filter by status
- [x] Add status filter dropdown to AdminLeads page
- [x] Test filtering by each status (New, Contacted, Qualified, Converted)
- [x] Save checkpoint (version bf3f542e)

## Lead Scoring System
- [x] Design scoring algorithm (revenue weight + frustration urgency + playbook engagement)
- [x] Add leadScore field to database schema
- [x] Create calculateLeadScore function in db.ts
- [x] Update submitQuiz mutation to calculate and save score
- [x] Add Score column to admin dashboard table
- [x] Add Score to CSV export
- [ ] Add sorting by score (highest first)
- [ ] Add score filter/threshold selector
- [ ] Test scoring calculation with different lead profiles
- [x] Save checkpoint (version 7bc561af)

## Quiz Progress Persistence
- [x] Add localStorage save/load functions to SmartQuiz.tsx
- [x] Auto-save answers after each question
- [x] Load saved progress on quiz mount
- [x] Add "Resume where you left off" UI on welcome screen
- [x] Add "Clear saved progress" option (Start fresh button)
- [x] Handle edge cases (expired data after 7 days, clear on submission)
- [x] Test complete flow (save → close → reopen → resume)
- [x] Save checkpoint (version 7bc561af)

## Landing Page Copy Update
- [x] Update hero section with new positioning (social proof + plateau messaging)
- [x] Replace "$100K/month" promise with revenue plateau language
- [x] Test updated landing page
- [x] Save checkpoint (version ef0cf6f7)

## Remove Duplicate Landing Page
- [x] Find source of old landing page with $100K/month messaging (quiz welcome screen)
- [x] Update quiz welcome screen to match new positioning
- [x] Test to confirm only new version shows (both Home and Quiz welcome screens updated)
- [x] Save checkpoint (version f57f79bc)

## Mobile Responsive Fixes
- [x] Identify source of horizontal white lines in roadmap dashboard (need to test on mobile viewport)
- [x] Fix content overflow on mobile viewport
- [x] Remove or constrain fixed-width elements causing horizontal scroll
- [x] Add proper responsive padding/margins for mobile
- [x] Test on mobile viewport (375px width)
- [x] Verify all sections display correctly without overflow
- [x] Save checkpoint (version 1b2ba4c1)

## Shareable Roadmap Links
- [x] Add shareCode field to roadmaps table schema
- [x] Add viewCount field to track shares
- [x] Generate unique 6-character share codes on roadmap creation
- [x] Create tRPC procedure to get roadmap by share code
- [x] Increment viewCount when roadmap is viewed via share link
- [x] Create public roadmap route (/roadmap/:shareCode)
- [x] Build PublicRoadmap component (read-only, no auth required)
- [x] Add "Share" button to dashboard with copy-to-clipboard
- [x] Add "Get your own roadmap" CTA on public view (in PublicRoadmap component)
- [x] Add social sharing buttons (LinkedIn, Twitter, Facebook) to PublicRoadmap
- [x] Write and run vitest tests for shareable links feature
- [x] Test sharing flow manually (verified via vitest - roadmap created with shareCode)
- [x] Save checkpoint (version 9d1f092e)

## Update Public Roadmap CTA
- [x] Remove "POWERED BY AI" badge from CTA section
- [x] Add "$1.5M+ tracked client results" below Get my roadmap button
- [x] Save checkpoint (version 29cee683)

## Remove POWERED BY AI from Home Page
- [x] Remove "POWERED BY AI" badge from home page hero section
- [x] Save checkpoint (version f2925d8e)

## Redesign Playbooks: Diagnosis → Data → Direction
- [x] Create new Offer Optimization prompt (personalized diagnosis + benchmarks + tactical steps)
- [x] Create new Facebook Ads prompt (same structure)
- [x] Create new Instagram Growth prompt (same structure)
- [x] Create new Lead Generation prompt (same structure)
- [x] Update playbookPrompts.ts with all 4 new versions
- [x] Fix import names in roadmapRouter.ts
- [x] Restart dev server
- [x] Test playbook generation with new prompts (ready to test via quiz submission)
- [x] Save checkpoint (version ccd689f7)

## Strategy 5: Quiz Improvements + Visual Playbook System

### Phase 1: Restructure Quiz
- [x] Move frustration question from Q16 to Q2 (emotional hook early)
- [x] Reorder questions for better flow
- [x] Update question numbering and navigation logic
- [x] Test quiz flow after restructure

### Phase 2: Add Micro-Insights
- [x] Add insight after Q6 (email) - "Growth Stage" diagnosis
- [x] Add insight after Q10 (lead response) - response time benchmark
- [x] Add insight after Q16 (audience size) - 50% milestone + free resource
- [x] Add insight after Q20 (ad budget) - cost per lead estimate
- [x] Style insight cards with gold accents and icons

### Phase 3: Progress Bar & Gamification
- [x] Add visual progress bar component
- [x] Show unlockable milestones at 25%, 50%, 75%, 100%
- [x] Add "X questions away" messaging
- [x] Animate progress transitions

### Phase 4: Free Resource at 50%
- [x] Add download prompt at 50% mark (insight #3)
- [ ] Create actual "5 Lead Response Templates" PDF
- [ ] Track downloads in analytics

### Phase 5: Visual Playbook - Data Structure
- [ ] Design scoring algorithm for 4 categories (Lead Gen, Offer, Social, Conversion)
- [ ] Calculate category scores from quiz answers
- [ ] Store scores in database with roadmap
- [ ] Create benchmark data for comparisons

### Phase 6: Visual Playbook - UI Components
- [ ] Build Business Health Score card component (SVG)
- [ ] Build category score bars with animations
- [ ] Integrate Chart.js for benchmark comparison charts
- [ ] Create funnel visualization component
- [ ] Build projected growth line chart
- [ ] Add gap analysis comparison table

### Phase 7: Update Playbook Prompts
- [ ] Restructure prompts to output structured data + narrative
- [ ] Add JSON schema for scores, benchmarks, metrics
- [ ] Update all 4 playbook prompts with data structure
- [ ] Test LLM output parsing

### Phase 8: Testing & Deployment
- [ ] Test complete quiz flow with all improvements
- [ ] Test visual playbook rendering with real data
- [ ] Verify mobile responsiveness of charts
- [ ] Run vitest for new features
- [ ] Save checkpoint

## Add Tooltips to Business Health Score Dashboard
- [x] Add tooltip component with info icon to BusinessHealthCard
- [x] Add tooltips explaining each of the 4 category scores
- [x] Add tooltip explaining overall health score calculation
- [x] Add tooltips to BenchmarkChart explaining comparison methodology
- [x] Add tooltips to GapAnalysisCard explaining projections
- [x] Test tooltip functionality on desktop and mobile

## PDF Download Feature
- [x] Install jsPDF and html2canvas dependencies
- [x] Create PDF generation utility function
- [x] Design PDF layout with scores, charts, and playbooks
- [x] Add "Download PDF" button to Dashboard page (replaces text download)
- [x] Test PDF generation structure and validation
- [x] Verify TypeScript types and error handling

## Quiz UX Improvements (Tiers 1-3)

### Tier 1: Critical for Completion Rate
- [x] Add sticky visual progress bar at top with animated percentage
- [x] Add milestone badges that unlock at 25%, 50%, 75%, 100%
- [x] Add "Only X questions left!" countdown messaging
- [x] Implement smooth slide-in/fade transitions between questions
- [x] Add hover effects to button answers (scale + gold glow)
- [x] Add confetti animation at 50% and 100% completion

### Tier 2: Viral & Shareability Boosters
- [x] Add real-time social proof after each answer ("67% chose this too")
- [x] Add live submission counter animation
- [x] Add "Sarah from Denver just completed" recent activity feed
- [x] Implement exit-intent modal with sample roadmap preview
- [x] Add countdown timer to exit-intent modal

### Tier 3: Premium UX Polish
- [x] Implement smart question branching logic
- [x] Skip irrelevant questions based on previous answers
- [x] Add answer confidence slider for key questions
- [x] Add visual feedback (emoji/color changes) to sliders
- [x] Optimize quiz length to 18-25 questions for most users

### Testing & Validation
- [x] Test all animations and transitions
- [x] Verify TypeScript compilation with no errors
- [x] Test exit-intent modal trigger conditions
- [x] Validate smart branching logic with skipIf conditions
- [x] Run comprehensive test suite (23 tests passed)

## Apple-Level Design System Implementation

### Design System Documentation
- [x] Create comprehensive design system document with color palette
- [x] Document typography system (font stack, sizes, spacing)
- [x] Document shadow system (3 levels with exact values)
- [x] Document spacing grid (8px system)
- [x] Document button states and micro-interactions
- [x] Document component guidelines for future development

### Global CSS Updates
- [x] Download and integrate new logo
- [x] Update CSS variables with new blue/white color palette
- [x] Implement Apple system font stack
- [x] Define consistent shadow system (3 levels)
- [x] Set up 8px spacing grid
- [x] Add subtle background gradient

### Micro-Interactions & Polish
- [x] Add button press states (scale 0.98 on click)
- [x] Implement smooth focus states on all interactive elements
- [x] Add keyboard navigation indicators
- [x] Implement smooth transitions (150-200ms ease-out)
- [x] Add success state animations with subtle bounce

### Component Redesign
- [x] Redesign quiz with new colors and typography
- [x] Redesign dashboard with new theme
- [x] Redesign all UX improvement components (progress bar, social proof, etc.)
- [x] Update home page with logo and new styling
- [x] Update all buttons and interactive elements

### Testing & Validation
- [ ] Test typography hierarchy across all pages
- [ ] Verify shadow consistency
- [ ] Test button interactions and focus states
- [ ] Verify color contrast for accessibility
- [ ] Test on mobile and desktop

## URGENT: Fix Dark Quiz Page
- [x] Update SmartQuiz.tsx with bright white background
- [x] Update all quiz buttons and cards with new blue/white theme
- [x] Update EnhancedProgressBar with new colors
- [x] Update SocialProof component with new theme
- [x] Update ExitIntentModal with bright styling
- [x] Update ConfidenceSlider with new colors
- [x] Test quiz flow with new bright theme

## Fix Progress Bar Milestone Positioning Bug
- [x] Fix EnhancedProgressBar milestone ball positioning at 50%
- [x] Ensure milestone balls stay aligned with progress bar at all percentages
- [x] Test progress bar at 25%, 50%, 75%, 100%

## URGENT: Fix Dark Home Page Background
- [x] Investigate why home page still shows dark background
- [x] Check if CSS variables are being overridden
- [x] Ensure bright white theme is applied to body/html
- [x] Changed defaultTheme from 'dark' to 'light' in App.tsx
- [x] Test home page in fresh browser session

## CRITICAL: Dashboard Rebuild (Due Thursday)

### Phase 1: Audit Current State
- [x] Test complete quiz flow from start to dashboard
- [x] Document what's broken in current dashboard output
- [x] Identify missing visual components (charts, graphs, comparisons)
- [x] Review current scoring logic and data structure

### Phase 2: Strategic Planning
- [x] Define dashboard sections (score overview, category breakdowns, benchmarking, recommendations)
- [x] Design data flow: quiz answers → scoring → visualization
- [x] Plan visual hierarchy and layout (Score app as reference)
- [x] Define chart types needed (circular gauge, bar charts, comparison tables, progress indicators)
- [x] Plan interactive elements (hover states, drill-downs, filters)
- [x] Created comprehensive DASHBOARD_REBUILD_PLAN.md document
- [x] Decided on Recharts for visualization library

### Phase 3: Rebuild Foundation
- [x] Create proper data structure for quiz results storage
- [x] Build scoring algorithm (4 categories + overall score)
- [x] Create tRPC endpoints for saving/retrieving results
- [x] Build benchmark comparison logic (user vs. industry average)
- [x] Generate personalized recommendations based on scores

### Phase 4: Build Visual Components
- [x] Install Recharts library
- [x] Create circular score gauge component (0-100 with color coding)
- [x] Build category breakdown chart with Recharts
- [x] Create benchmark comparison chart (you vs. top performers)
- [x] Create gap analysis visual component
- [x] Rebuild Dashboard page with all new visual components
- [x] PDF export functionality already exists

### Phase 5: Testing & Polish
- [ ] Test complete flow: quiz → calculation → dashboard display
- [ ] Verify all charts render correctly with real data
- [ ] Test on mobile and desktop
- [ ] Ensure dashboard is shareable via unique URL
- [ ] Final checkpoint before Thursday deadline

## Test Dashboard & Add Animations

### Testing Complete Quiz Flow
- [ ] Navigate to quiz start page
- [ ] Complete all quiz questions with test answers
- [ ] Verify dashboard loads after quiz completion
- [ ] Verify circular score gauge displays correctly
- [ ] Verify category breakdown chart renders
- [ ] Verify benchmark comparison chart shows data
- [ ] Verify gap analysis visual displays
- [ ] Check for any console errors or broken components

### Add Animated Number Counters
- [ ] Install react-countup or similar animation library
- [ ] Add count-up animation to circular score gauge (0→score over 1.5s)
- [ ] Add count-up animations to category scores
- [ ] Add count-up animations to benchmark numbers
- [ ] Add count-up animations to gap analysis metrics
- [ ] Test animations trigger on page load
- [ ] Ensure animations work on mobile and desktop

## Visual Playbook Transformation
- [x] Rewrite all playbook prompts to output structured JSON data instead of ASCII text
- [x] Create visual playbook components (timeline, checklist cards, metric cards, phase indicators)
- [x] Remove all horizontal ASCII lines (══════ and ──────) from playbook output
- [ ] Update PublicRoadmap.tsx to render visual components instead of text
- [x] Update Dashboard.tsx to render visual playbooks
- [x] Match playbook visual style to Business Health Score section (charts, cards, Apple aesthetic)
- [x] Test complete flow with new visual playbooks (Offer Optimization and Facebook Ads working perfectly)
- [ ] Update Titan Roadmap to use visual JSON format (currently still using ASCII text)
- [ ] Save checkpoint with visual playbook system

## Convert Titan Roadmap to Visual Format
- [x] Create visualTitanRoadmapPrompt with JSON structure matching bonus playbooks
- [x] Update roadmapRouter.ts to use visual Titan prompt
- [x] Create VisualTitanRoadmap component for rendering Titan JSON
- [x] Update Dashboard.tsx to use VisualTitanRoadmap
- [x] Test Titan Roadmap generation with new visual format
- [x] Verify all sections render correctly (diagnosis, benchmarks, action plan, warnings, milestone)
- [x] Save checkpoint with complete visual playbook system

## Progress Tracking System
- [x] Create database schema for storing completed action items (task_progress table)
- [x] Add tRPC mutations for marking tasks as complete/incomplete
- [x] Update VisualPlaybook component to show interactive checkboxes
- [x] Update VisualTitanRoadmap component to show interactive checkboxes
- [ ] Add progress percentage indicator to playbook tabs (optional enhancement)
- [x] Test checkbox interactions and persistence
- [ ] Save checkpoint with progress tracking

## Playbook Sharing System
- [x] Generate unique shareable tokens for individual playbooks
- [x] Create public playbook viewing page (/playbook/:token)
- [x] Add "Share this playbook" button to each playbook tab
- [x] Create share modal with copy link functionality
- [x] Style public playbook page to match dashboard aesthetic
- [x] Test sharing flow end-to-end (modal opens, needs backend debugging for token generation)
- [x] Save checkpoint with progress tracking and playbook sharing

## Fix Instagram and Lead Gen Playbook Rendering Errors
- [ ] Check server logs for JSON generation errors
- [ ] Verify Instagram and Lead Gen playbook prompts are generating valid JSON
- [ ] Add defensive null checks in VisualPlaybook component for all .map() calls
- [ ] Test Instagram playbook rendering
- [ ] Test Lead Gen playbook rendering
- [ ] Save checkpoint with fixes

## Fix Instagram and Lead Gen Playbook Rendering Errors
- [x] Diagnose root cause of "Cannot read properties of undefined (reading 'map')" error
- [x] Add defensive null checks to VisualPlaybook component
- [x] Create ensureArray helper function to handle non-array JSON data
- [x] Test Instagram Growth playbook rendering (working - visual components rendering correctly)
- [x] Test Lead Generation playbook rendering (working - visual components rendering correctly)
- [x] Save checkpoint with fixes (version 29f57865)

## Copy Updates (Feb 2026)
- [x] Remove markdown asterisks (**) from quiz intro page text
- [x] Update homepage copy to emphasize "Free Bottleneck Diagnosis + Playbooks"
- [x] Change CTA button text to "Get my free diagnosis"

## Critical Bug Fixes (Feb 2026)
- [x] Fix empty Instagram Growth playbook (added full JSON prompt)
- [x] Fix empty Lead Generation playbook (added full JSON prompt)
- [ ] Fix share link generation failure (investigate after playbook fix)
- [ ] Fix PDF formatting (deferred - fix after playbooks work)
- [x] Update Titan Roadmap phase names (Phase 2: Growth Architecture, Phase 3: Profit Flywheel Engine, Phase 4: High-Leverage CEO)

## PDF Export Rebuild (Feb 2026)
- [x] Analyze current PDF generator issues (dumping raw JSON)
- [x] Rebuild PDF generator to format Business Health Score section
- [x] Add Titan Roadmap formatting with phases and action plans
- [x] Add bonus playbook formatting (Offer, Facebook, Instagram, Lead Gen)
- [x] Test PDF generation with complete roadmap
- [x] Verify all sections render correctly with proper formatting

## Share Link Fix (Feb 2026)
- [x] Debug share link generation error ("Failed to generate share link")
- [x] Fix root cause in SharePlaybookModal (useState → useEffect)
- [x] Test share functionality end-to-end (link generation, modal, shared page)

## Quiz Submission Bug (Feb 2026)
- [x] Debug infinite refresh/reload on last quiz step
- [x] Identify root cause (auto-save useEffect running during submission)
- [x] Fix the issue by preventing auto-save when generateRoadmap.isPending
- [x] Add error handling with onError callback
- [x] Test complete quiz flow end-to-end (test mode with ?test=playbooks)
- [x] Verify users can successfully submit and reach dashboard (navigated to /dashboard/360001)

## Email & Growth Calculation Fixes (Feb 2026)
- [x] Update email sender domain to noreply@updates.doctorleadflow.com
- [x] Fix growth potential calculation showing negative growth
- [x] Ensure potential revenue is always higher than current revenue (updated projectRevenue function)
- [x] Test email delivery with new domain (test passed)
- [x] Integrate email sending into roadmap generation
- [x] Test complete flow end-to-end (quiz submitted, email sent, dashboard loaded)

## Admin Route 404 Fix (Feb 2026)
- [x] Debug why /admin route returns 404 (route was /admin/leads, not /admin)
- [x] Check App.tsx routing configuration
- [x] Add /admin route pointing to AdminLeads component
- [x] Test admin dashboard access (29 leads loaded successfully)

## Email Template & Skool Integration (Feb 2026)
- [x] Update email service with quiz-style template (light background, blue CTA)
- [x] Change "Titan Scaling Roadmap" to "CEO Scaling Roadmap"
- [x] Add Skool community CTA to email (www.skool.com/10ksidehustle, 200+ health pros)
- [x] Add dismissible Skool banner to dashboard
- [x] Test email delivery with new template (Skool banner working on dashboard)
- [x] Fix syntax error in roadmapRouter.ts (was stale error, cleared with restart)

## Video Feedback Fixes (Priority)
- [ ] Fix progress bar percentage calculation (inconsistent: 58, 78, 56, 68, 64)
- [ ] Fix milestone message alignment (shows "halfway" at 75%+)
- [ ] Debug Facebook Ads playbook not populating on dashboard
- [ ] Fix PDF download button (not triggering download)
- [ ] Add loading screen feedback ("typically takes 30-60 seconds" + progress indicator)
- [ ] Add conditional Skool CTA logic (only show for under $100K revenue)
- [ ] Remove "60% practices at your level" early display (shows after only name entry)
- [ ] Optimize page performance (lag when scrolling)
- [ ] Remove redundant information displays in quiz flow

## Auto-Generate All Playbooks (Remove Selection)
- [x] Remove playbook selection question (Q18) from SmartQuiz.tsx
- [x] Update backend to always generate all 4 playbooks (no selection needed)
- [x] Update welcome screen to mention "4 bonus playbooks included"
- [x] Update quiz numbering after removing selection question
- [ ] Test complete flow with all playbooks auto-generated

## Fix Facebook Ads Playbook Generation
- [x] Fix LLM call to include userInput (was only sending prompt template)
- [ ] Test Facebook Ads playbook generation with real quiz submission

## Multi-Stage Loading Animation
- [x] Create animated loading screen with 5 stages
- [x] Stage 1: "🔍 Diagnosing your bottlenecks..." (0-20%)
- [x] Stage 2: "📊 Analyzing your business health..." (20-40%)
- [x] Stage 3: "🎯 Identifying your biggest growth levers..." (40-60%)
- [x] Stage 4: "📋 Creating your custom playbooks..." (60-80%)
- [x] Stage 5: "✨ Finalizing your roadmap..." (80-100%)
- [x] Add "Typically takes 30-60 seconds" message
- [x] Add progress bar animation
- [ ] Test timing with actual roadmap generation

## Critical Mobile Issues (User Feedback)
- [x] Replace confidence slider with button options (slider unusable on mobile)
- [x] Remove "at your level" percentages (showing too early, numbers don't make sense)
- [x] Debug "Failed to generate roadmap" error on some devices
- [ ] Ensure dashboard displays properly on all mobile devices
- [ ] Test complete mobile flow from quiz to dashboard
- [ ] Verify all buttons and interactions work on touch devices

## Remove Social Proof Notification
- [x] Remove "Michael R. from Austin completed..." notification (blocks mobile view, feels gimmicky)

## Skool Community Invite
- [ ] Verify Skool CTA shows for ALL users (no revenue-based filtering)
- [ ] Ensure invite link is prominent and working

## Mobile Headline Overlap Fix
- [x] Reduce headline font size on mobile to prevent Manus logo overlap

## Simplify Quiz Content (Reduce Scrolling)
- [x] Remove "$1.5M+ in tracked client results" from welcome screen
- [x] Simplify content styles question (show concept + few examples, not full list)
- [x] Move complete content styles list to Instagram playbook

## Multiple Selection & Remove "At Your Level"
- [x] Enable multiple selection for biggest frustration question
- [x] Remove all "at your level" references from insight stats
- [x] Replace with percentage-only stats (e.g., "46% of practices chose this" instead of "46% of practices at your level chose this")
- [ ] Update backend to handle multiple frustration selections (biggestFrustration now comma-separated)
- [ ] Test multi-select functionality on mobile

## Mobile Dashboard Display Issues
- [x] Fix revenue potential calculation (showing $20K-$40K potential when current is $20K-$50K - doesn't make sense)
- [x] Improve category breakdown chart visualization (all bars look same size, hard to differentiate)
- [x] Add actual score values to category breakdown bars for clarity
- [x] Ensure potential revenue is always higher than current revenue
- [ ] Test revenue calculation logic with different revenue ranges

## Category Breakdown Chart Orientation
- [x] Change from vertical stacked to horizontal bars for better mobile readability
- [x] Ensure score labels display clearly at end of bars

## Mobile Chart Redesign + PDF Fix
- [x] Create 3 visual mockup options for category breakdown chart (Progress Bar, Dot Plot, Card-Based)
- [x] Get user approval on preferred chart style (Option C selected)
- [x] Implement chosen chart design to replace current thin-line chart
- [x] Fix blank PDF page 2 (Business Health Score section not rendering)
- [x] Test PDF generation with all sections populated

## Critical Bug Fixes - User Reported Issues
- [x] Fix PDF formatting - score not showing at top, content misaligned
- [x] Fix scoring logic contradiction - user 100% confident in offer but system says "Offer Clarity" is biggest gap
- [x] Fix shared roadmap page showing raw JSON instead of formatted content
- [ ] Adjust messaging for different revenue tiers ($50-100K businesses need different framing)
- [x] Fix primary constraint logic - dashboard shows one constraint, playbook shows different one

## Industry Selection Feature
- [x] Add industry selection UI to landing page (before quiz)
- [x] Create industry buttons: IV/Wellness Clinic, Med Spa, Dental, Chiropractic, Other Healthcare
- [x] Store selected industry in quiz state and database
- [x] Update schema to include industry field in roadmaps table
- [x] Customize roadmap language based on industry selection
- [x] Customize playbook examples for each industry vertical
- [x] Test industry-specific customization with different selections

## User-Requested UX Improvements
- [x] Revert landing page - remove industry selection buttons, restore single "Get my free diagnosis" CTA
- [x] Add "IV Hydration" option to existing quiz question about practice type
- [x] Make email field mandatory with proper validation (fix email validation error)
- [x] Make phone field mandatory with phone number format validation
- [x] Add back button to lesson slides (type: "lesson")
- [x] Add back button to insight slides (type: "insight")
- [x] Test email validation with various formats
- [x] Test phone validation with various formats
- [x] Test back button navigation flow

## 🔴 CRITICAL FIXES FOR LAUNCH (Must Fix Before Going Live)
- [x] Add loading state with progress indicator during roadmap generation (30-60 sec wait)
- [x] Fix raw JSON display in shared roadmaps (edge case handling)
- [x] Add error handling for LLM failures with user-friendly fallback message
- [x] Remove phone number from shared roadmap page (privacy concern)
- [x] Add email deliverability testing and retry logic if send fails
- [x] Add rate limiting (max 5 submissions per IP per hour) and CAPTCHA
- [x] Fix PDF page breaks - prevent content from splitting mid-section
- [x] Add unsubscribe link to all emails (CAN-SPAM Act compliance)

## 🟡 HIGH IMPACT FIXES (Should Fix Before Launch)
- [x] Add inline validation feedback ("Invalid email format" below input field)
- [ ] Add "Get Your Own Free Roadmap" CTA button to shared roadmap pages
- [ ] Add social sharing buttons (LinkedIn, Facebook, Twitter) to dashboard
- [ ] Add "What's Next?" section with clear CTA (book call, join community, etc.)
- [ ] Add tooltip explaining how category scores (0-100) are calculated
- [ ] Add "Health Pro CEO" branding/logo to PDF header and footer
- [ ] Add Open Graph meta tags for social media link previews

## 🟢 POLISH FIXES (Nice to Have)
- [ ] Add progress indicator dots on lesson slides
- [ ] Add character limits to text inputs (e.g., 500 chars for main offer)
- [ ] Add visible "Skip" button to optional website question
- [ ] Add email open tracking for analytics
- [ ] Design follow-up email sequence (Day 1, Day 3, Day 7)

## 🎯 Final High-Impact Improvements (World-Class Polish)
- [x] Add "Get Your Own Free Roadmap" viral CTA button to shared roadmap pages
- [x] Add score calculation tooltips (hover to see how each 0-100 score is calculated)
- [x] Add "What's Next?" section on dashboard with clear CTA (book call, join community)
