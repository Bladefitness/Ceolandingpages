import jsPDF from 'jspdf';

// Sanitize text for jsPDF - replace Unicode characters that cause rendering issues
function pdfSafe(text: string): string {
  return text
    .replace(/→/g, '>')
    .replace(/←/g, '<')
    .replace(/✓/g, '-')
    .replace(/✗/g, 'x')
    .replace(/•/g, '-')
    .replace(/—/g, '-')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/"/g, '"');
}

interface RoadmapData {
  businessName: string;
  email?: string;
  createdAt: Date | string;
  titanRoadmap: string | null;
  offerPlaybook?: string | null;
  facebookAdLaunch?: string | null;
  instagramGrowth?: string | null;
  leadGeneration?: string | null;
  businessHealthScores?: {
    overall: number;
    leadGeneration: number;
    offerClarity: number;
    socialPresence: number;
    conversionProcess: number;
    topStrength: string;
    biggestGap: string;
  };
  benchmarkData?: Array<{
    category: string;
    yourScore: number;
    industryAverage: number;
    topPerformers: number;
  }>;
  gapAnalysis?: {
    currentRevenue: string;
    currentLeads: number;
    currentCloseRate: number;
    potentialRevenue: string;
    potentialLeads: number;
    potentialCloseRate: number;
  };
}

export async function generatePDF(roadmap: RoadmapData): Promise<void> {
  const rawPdf = new jsPDF('p', 'mm', 'a4');

  // Wrap pdf.text to auto-sanitize Unicode characters that jsPDF can't render
  const pdf = new Proxy(rawPdf, {
    get(target, prop, receiver) {
      if (prop === 'text') {
        return (text: string | string[], x: number, y: number, options?: any) => {
          const sanitized = Array.isArray(text) ? text.map(pdfSafe) : pdfSafe(text);
          return target.text(sanitized, x, y, options);
        };
      }
      if (prop === 'getTextWidth') {
        return (text: string) => {
          return target.getTextWidth(pdfSafe(text));
        };
      }
      if (prop === 'splitTextToSize') {
        return (text: string, maxWidth: number) => {
          return target.splitTextToSize(pdfSafe(text), maxWidth);
        };
      }
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === 'function') return val.bind(target);
      return val;
    }
  }) as jsPDF;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 22;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;
  const footerHeight = 14;
  const bottomLimit = pageHeight - margin - footerHeight;
  let currentPageNumber = 1;
  const reportDate = new Date(roadmap.createdAt).toLocaleDateString();

  // ── Color constants ──────────────────────────────────────────────
  const GOLD: [number, number, number] = [229, 193, 88];
  const DARK: [number, number, number] = [10, 14, 26];
  const GRAY_TEXT: [number, number, number] = [60, 60, 60];
  const GRAY_LIGHT: [number, number, number] = [156, 163, 175];
  const RED: [number, number, number] = [239, 68, 68];
  const GREEN: [number, number, number] = [16, 185, 129];
  const DIVIDER: [number, number, number] = [229, 231, 235]; // #E5E7EB

  // ── Helper: add footer to current page ───────────────────────────
  const addPageFooter = () => {
    const footerY = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');

    // Left: brand
    pdf.setTextColor(...GRAY_LIGHT);
    pdf.text('Health Pro CEO', margin, footerY);

    // Center: page number
    pdf.text(`Page ${currentPageNumber}`, pageWidth / 2, footerY, { align: 'center' });

    // Right: date
    pdf.text(reportDate, pageWidth - margin, footerY, { align: 'right' });

    // Thin line above footer
    pdf.setDrawColor(...DIVIDER);
    pdf.setLineWidth(0.3);
    pdf.line(margin, footerY - 4, pageWidth - margin, footerY - 4);
  };

  // ── Helper: add a new page with footer on current, header on next ─
  const addNewPage = () => {
    addPageFooter();
    pdf.addPage();
    currentPageNumber++;
    yPosition = margin;
    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  // ── Helper: check page break (footer-aware) ─────────────────────
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > bottomLimit) {
      addNewPage();
      return true;
    }
    return false;
  };

  // ── Helper: section gap ──────────────────────────────────────────
  const addSectionGap = (size: number = 10) => {
    yPosition += size;
  };

  // ── Helper: section divider ──────────────────────────────────────
  const addSectionDivider = () => {
    pdf.setDrawColor(...DIVIDER);
    pdf.setLineWidth(0.3);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;
  };

  // ── Helper: colored section header with background strip ─────────
  const addSectionHeader = (
    text: string,
    bgColor: [number, number, number],
    textColor: [number, number, number],
    fontSize: number = 14
  ) => {
    checkPageBreak(18);
    const headerHeight = 10;
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.roundedRect(margin, yPosition - 2, contentWidth, headerHeight, 1.5, 1.5, 'F');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, margin + 5, yPosition + 5);
    yPosition += headerHeight + 4;
  };

  // ── Helper: add wrapped text with improved spacing ───────────────
  const addWrappedText = (text: string, fontSize: number, colorHex: string, bold: boolean = false) => {
    pdf.setFontSize(fontSize);
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);
    pdf.setTextColor(r, g, b);
    if (bold) pdf.setFont('helvetica', 'bold');
    else pdf.setFont('helvetica', 'normal');

    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.55;

    lines.forEach((line: string) => {
      checkPageBreak(lineHeight);
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // ════════════════════════════════════════════════════════════════════
  //  COVER PAGE
  // ════════════════════════════════════════════════════════════════════
  pdf.setFillColor(...DARK);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Brand name
  pdf.setFontSize(32);
  pdf.setTextColor(...GOLD);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Health Pro CEO', pageWidth / 2, 75, { align: 'center' });

  // Subtitle
  pdf.setFontSize(14);
  pdf.setTextColor(...GRAY_LIGHT);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Personalized Growth Report', pageWidth / 2, 88, { align: 'center' });

  // Decorative line
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth / 2 - 40, 96, pageWidth / 2 + 40, 96);

  // Report title
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Business Health Score Report', pageWidth / 2, 115, { align: 'center' });

  // Business name
  pdf.setFontSize(16);
  pdf.setTextColor(...GRAY_LIGHT);
  pdf.setFont('helvetica', 'normal');
  pdf.text(roadmap.businessName, pageWidth / 2, 132, { align: 'center' });

  // Date
  pdf.setFontSize(12);
  pdf.text(`Generated: ${reportDate}`, pageWidth / 2, 145, { align: 'center' });

  // Bottom decorative line
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.line(margin, 160, pageWidth - margin, 160);

  // Website at bottom
  pdf.setFontSize(10);
  pdf.setTextColor(...GRAY_LIGHT);
  pdf.text('healthproceo.com', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // ════════════════════════════════════════════════════════════════════
  //  PAGE 2: BUSINESS HEALTH SCORES
  // ════════════════════════════════════════════════════════════════════
  addNewPage();

  pdf.setFontSize(20);
  pdf.setTextColor(...DARK);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Business Health Score', margin, yPosition);
  yPosition += 15;

  if (roadmap.businessHealthScores) {
    const scores = roadmap.businessHealthScores;

    // Overall Score label
    pdf.setFontSize(14);
    pdf.setTextColor(...GRAY_TEXT);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Overall Health Score', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // Circular background for score
    const circleX = pageWidth / 2;
    const circleY = yPosition + 16;
    const circleRadius = 22;
    pdf.setDrawColor(...GOLD);
    pdf.setLineWidth(1.5);
    pdf.circle(circleX, circleY, circleRadius, 'S');
    // Inner subtle circle
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.3);
    pdf.circle(circleX, circleY, circleRadius - 3, 'S');

    // Score number
    pdf.setFontSize(48);
    pdf.setTextColor(...GOLD);
    pdf.setFont('helvetica', 'bold');
    pdf.text(scores.overall.toString(), circleX, circleY + 6, { align: 'center' });

    // "/100" below circle
    pdf.setFontSize(12);
    pdf.setTextColor(...GRAY_LIGHT);
    pdf.setFont('helvetica', 'normal');
    pdf.text('out of 100', circleX, circleY + circleRadius + 8, { align: 'center' });
    yPosition = circleY + circleRadius + 18;

    addSectionDivider();
    addSectionGap(5);

    // Category Breakdown header
    checkPageBreak(45);
    pdf.setFontSize(16);
    pdf.setTextColor(...DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Category Breakdown', margin, yPosition);
    yPosition += 12;

    const categories = [
      { name: 'Lead Generation', score: scores.leadGeneration, color: [6, 182, 212] as [number, number, number] },
      { name: 'Offer Clarity', score: scores.offerClarity, color: [139, 92, 246] as [number, number, number] },
      { name: 'Social Presence', score: scores.socialPresence, color: [16, 185, 129] as [number, number, number] },
      { name: 'Conversion Process', score: scores.conversionProcess, color: [245, 158, 11] as [number, number, number] },
    ];

    categories.forEach((cat) => {
      checkPageBreak(33);

      const cardHeight = 25;

      // Card background
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, yPosition - 3, contentWidth, cardHeight, 2, 2, 'F');

      // Colored left border
      pdf.setFillColor(cat.color[0], cat.color[1], cat.color[2]);
      pdf.rect(margin, yPosition - 3, 3, cardHeight, 'F');

      // Category name
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...GRAY_TEXT);
      pdf.text(cat.name, margin + 10, yPosition + 7);

      // Score - large and bold
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...DARK);
      pdf.text(`${cat.score}`, pageWidth - margin - 32, yPosition + 10);

      // "/100" label
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...GRAY_LIGHT);
      pdf.text('/100', pageWidth - margin - 14, yPosition + 10);

      // Progress bar
      const barY = yPosition + 17;
      const barWidth = contentWidth - 18;
      pdf.setFillColor(226, 232, 240);
      pdf.roundedRect(margin + 10, barY, barWidth, 3, 1, 1, 'F');
      pdf.setFillColor(cat.color[0], cat.color[1], cat.color[2]);
      const filledWidth = (barWidth * cat.score) / 100;
      if (filledWidth > 2) {
        pdf.roundedRect(margin + 10, barY, filledWidth, 3, 1, 1, 'F');
      } else {
        pdf.rect(margin + 10, barY, filledWidth, 3, 'F');
      }

      yPosition += cardHeight + 8; // 8mm gap between cards
    });

    addSectionGap(10);
    addSectionDivider();
    addSectionGap(5);

    // Key Insights
    checkPageBreak(55);
    pdf.setFontSize(16);
    pdf.setTextColor(...DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Insights', margin, yPosition);
    yPosition += 12;

    // Top Strength Card
    checkPageBreak(38);
    pdf.setFillColor(240, 253, 244);
    pdf.roundedRect(margin, yPosition - 3, contentWidth, 30, 2, 2, 'F');
    pdf.setFillColor(...GREEN);
    pdf.rect(margin, yPosition - 3, 3, 30, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...GREEN);
    pdf.text('TOP STRENGTH', margin + 10, yPosition + 5);

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK);
    pdf.text(scores.topStrength, margin + 10, yPosition + 14);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...GRAY_TEXT);
    pdf.text('This is where you excel. Keep leveraging this advantage.', margin + 10, yPosition + 22);

    yPosition += 38;

    // Biggest Gap Card
    checkPageBreak(38);
    pdf.setFillColor(254, 242, 242);
    pdf.roundedRect(margin, yPosition - 3, contentWidth, 30, 2, 2, 'F');
    pdf.setFillColor(...RED);
    pdf.rect(margin, yPosition - 3, 3, 30, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...RED);
    pdf.text('BIGGEST GAP', margin + 10, yPosition + 5);

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK);
    pdf.text(scores.biggestGap.replace(' needs improvement', ''), margin + 10, yPosition + 14);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...GRAY_TEXT);
    pdf.text('Focus here first for maximum impact on revenue.', margin + 10, yPosition + 22);

    yPosition += 35;
  }

  // ════════════════════════════════════════════════════════════════════
  //  PAGE 3: GAP ANALYSIS
  // ════════════════════════════════════════════════════════════════════
  if (roadmap.gapAnalysis) {
    addNewPage();

    pdf.setFontSize(20);
    pdf.setTextColor(...DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Your Growth Potential', margin, yPosition);
    yPosition += 15;

    const gap = roadmap.gapAnalysis;

    const metrics = [
      { label: 'Monthly Revenue', current: gap.currentRevenue, potential: gap.potentialRevenue },
      { label: 'Monthly Leads', current: gap.currentLeads.toString(), potential: Math.round(gap.potentialLeads).toString() },
      { label: 'Close Rate', current: `${gap.currentCloseRate}%`, potential: `${gap.potentialCloseRate}%` },
    ];

    // Calculate growth percentages
    const growthPcts: string[] = [];
    // Revenue: extract midpoint from ranges like "$20K-$50K"
    const extractMidpoint = (range: string): number => {
      const numbers = range.match(/\d+/g);
      if (!numbers || numbers.length === 0) return 0;
      if (numbers.length === 1) return parseInt(numbers[0]);
      return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
    };
    const revCurrent = extractMidpoint(gap.currentRevenue);
    const revPotential = extractMidpoint(gap.potentialRevenue);
    growthPcts.push(revCurrent > 0 ? `+${Math.round(((revPotential - revCurrent) / revCurrent) * 100)}%` : 'N/A');
    growthPcts.push(gap.currentLeads > 0 ? `+${Math.round(((gap.potentialLeads - gap.currentLeads) / gap.currentLeads) * 100)}%` : 'N/A');
    growthPcts.push(gap.currentCloseRate > 0 ? `+${Math.round(((gap.potentialCloseRate - gap.currentCloseRate) / gap.currentCloseRate) * 100)}%` : 'N/A');

    // 3 columns side-by-side
    const colGap = 6;
    const colWidth = (contentWidth - colGap * 2) / 3;
    const boxHeight = 62;

    checkPageBreak(boxHeight + 10);

    metrics.forEach((metric, i) => {
      const colX = margin + i * (colWidth + colGap);

      // Box background
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(colX, yPosition, colWidth, boxHeight, 2, 2, 'F');

      // Top border accent
      pdf.setFillColor(...GOLD);
      pdf.rect(colX, yPosition, colWidth, 2, 'F');

      // Label
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...GRAY_LIGHT);
      pdf.text(metric.label.toUpperCase(), colX + colWidth / 2, yPosition + 10, { align: 'center' });

      // Current value
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...GRAY_TEXT);
      pdf.text('Current', colX + colWidth / 2 - 14, yPosition + 20);

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...DARK);
      pdf.text(metric.current, colX + colWidth / 2, yPosition + 28, { align: 'center' });

      // Arrow
      pdf.setFontSize(10);
      pdf.setTextColor(...GOLD);
      pdf.setFont('helvetica', 'bold');
      pdf.text('-->', colX + colWidth / 2, yPosition + 35, { align: 'center' });

      // Potential value
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...GRAY_TEXT);
      pdf.text('Potential', colX + colWidth / 2 - 14, yPosition + 41);

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...GOLD);
      pdf.text(metric.potential, colX + colWidth / 2, yPosition + 49, { align: 'center' });

      // Growth badge at bottom
      const badgeY = yPosition + boxHeight - 1;
      const badgeHeight = 10;
      pdf.setFillColor(240, 253, 244); // light green
      pdf.roundedRect(colX, badgeY, colWidth, badgeHeight, 0, 0, 'F');
      // bottom rounded corners overlap fix
      pdf.roundedRect(colX, badgeY, colWidth, badgeHeight, 2, 2, 'F');

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...GREEN);
      pdf.text(`Growth: ${growthPcts[i]}`, colX + colWidth / 2, badgeY + 7, { align: 'center' });
    });

    yPosition += boxHeight + 18;

    // Bottom line summary
    addSectionDivider();
    addSectionGap(3);

    pdf.setFillColor(255, 248, 225);
    pdf.roundedRect(margin, yPosition, contentWidth, 28, 2, 2, 'F');
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK);
    pdf.text('The Bottom Line', margin + 8, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...GRAY_TEXT);
    const bottomLine = 'By fixing your biggest gaps, you could 2-3x your current revenue in the next 90-180 days.';
    const bottomLines = pdf.splitTextToSize(bottomLine, contentWidth - 16);
    bottomLines.forEach((line: string) => {
      pdf.text(line, margin + 8, yPosition);
      yPosition += 5;
    });
  }

  // ════════════════════════════════════════════════════════════════════
  //  TITAN ROADMAP RENDERER
  // ════════════════════════════════════════════════════════════════════
  const renderTitanRoadmap = (content: string) => {
    try {
      const data = JSON.parse(content);

      addNewPage();

      // Page title
      pdf.setFontSize(20);
      pdf.setTextColor(...GOLD);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Titan Scaling Roadmap', margin, yPosition);
      yPosition += 14;

      addSectionDivider();
      addSectionGap(5);

      // ── Diagnosis ────────────────────────────────────────────────
      if (data.diagnosis) {
        addSectionHeader('Your Current State', [235, 243, 255], DARK);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...GRAY_TEXT);
        const snapLines = pdf.splitTextToSize(data.diagnosis.snapshot || '', contentWidth - 4);
        snapLines.forEach((line: string) => {
          checkPageBreak(6);
          pdf.text(line, margin + 2, yPosition);
          yPosition += 5.5;
        });
        addSectionGap(5);

        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...DARK);
        pdf.text('Primary Constraint:', margin + 2, yPosition);
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...GRAY_TEXT);
        const constLines = pdf.splitTextToSize(data.diagnosis.primaryConstraint || '', contentWidth - 4);
        constLines.forEach((line: string) => {
          checkPageBreak(6);
          pdf.text(line, margin + 2, yPosition);
          yPosition += 5.5;
        });
        addSectionGap(10);
        addSectionDivider();
        addSectionGap(5);
      }

      // ── Titan Phase ──────────────────────────────────────────────
      if (data.titanPhase) {
        const phaseLabel = data.titanPhase.phase || 'Phase';
        addSectionHeader(phaseLabel, [255, 248, 225], DARK);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...GRAY_TEXT);
        pdf.text('Mission:', margin + 2, yPosition);
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        const missionLines = pdf.splitTextToSize(data.titanPhase.mission || '', contentWidth - 4);
        missionLines.forEach((line: string) => {
          checkPageBreak(6);
          pdf.text(line, margin + 2, yPosition);
          yPosition += 5.5;
        });
        addSectionGap(10);
        addSectionDivider();
        addSectionGap(5);
      }

      // ── Action Plan ──────────────────────────────────────────────
      if (data.actionPlan) {
        addSectionHeader('Your Action Plan', [235, 243, 255], DARK);

        if (data.actionPlan.primaryBuild) {
          pdf.setFontSize(12);
          pdf.setTextColor(...GOLD);
          pdf.setFont('helvetica', 'bold');
          pdf.text(data.actionPlan.primaryBuild.title || 'Primary Build', margin + 2, yPosition);
          yPosition += 7;

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...GRAY_TEXT);
          const descLines = pdf.splitTextToSize(data.actionPlan.primaryBuild.description || '', contentWidth - 4);
          descLines.forEach((line: string) => {
            checkPageBreak(6);
            pdf.text(line, margin + 2, yPosition);
            yPosition += 5.5;
          });
          addSectionGap(5);

          if (data.actionPlan.primaryBuild.components && Array.isArray(data.actionPlan.primaryBuild.components)) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...DARK);
            pdf.text('Key Components:', margin + 2, yPosition);
            yPosition += 6;
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...GRAY_TEXT);
            data.actionPlan.primaryBuild.components.forEach((comp: string) => {
              checkPageBreak(6);
              const compLines = pdf.splitTextToSize(`  -  ${comp}`, contentWidth - 12);
              compLines.forEach((line: string) => {
                pdf.text(line, margin + 6, yPosition);
                yPosition += 5.5;
              });
            });
            addSectionGap(5);
          }
        }

        // Weekly Plan
        if (data.actionPlan.weeklyPlan && Array.isArray(data.actionPlan.weeklyPlan)) {
          addSectionGap(5);
          // Ensure header + at least 2 lines stay together
          checkPageBreak(25);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...DARK);
          pdf.text('Weekly Breakdown', margin + 2, yPosition);
          yPosition += 10;

          data.actionPlan.weeklyPlan.forEach((week: any) => {
            // Ensure week header + at least 2 content lines stay together
            checkPageBreak(22);

            pdf.setFontSize(11);
            pdf.setTextColor(...GOLD);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Week ${week.week}: ${week.title || ''}`, margin + 2, yPosition);
            yPosition += 7;

            if (week.days && Array.isArray(week.days)) {
              pdf.setFontSize(10);
              week.days.forEach((day: any) => {
                checkPageBreak(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(...GRAY_TEXT);
                pdf.text(`${day.dayRange}: ${day.task || ''}`, margin + 8, yPosition);
                yPosition += 6;

                if (day.details && Array.isArray(day.details)) {
                  pdf.setFont('helvetica', 'normal');
                  day.details.forEach((detail: string) => {
                    checkPageBreak(6);
                    const detailLines = pdf.splitTextToSize(`  -  ${detail}`, contentWidth - 20);
                    detailLines.forEach((line: string) => {
                      pdf.text(line, margin + 14, yPosition);
                      yPosition += 5.5;
                    });
                  });
                }
                yPosition += 3;
              });
            }
            yPosition += 5;
          });
        }
      }

      // ── Warnings ─────────────────────────────────────────────────
      if (data.warnings && Array.isArray(data.warnings)) {
        addSectionGap(5);
        // Ensure header + at least first warning stay together
        checkPageBreak(30);

        addSectionHeader('Critical Warnings', [254, 242, 242], RED);

        data.warnings.forEach((warning: any) => {
          checkPageBreak(16);

          // Light red background strip for each warning
          const warningText = warning.title || '';
          const reasonText = warning.reason || '';
          const reasonLines = pdf.splitTextToSize(reasonText, contentWidth - 18);
          const stripHeight = 8 + reasonLines.length * 5.5;

          pdf.setFillColor(254, 249, 249);
          pdf.roundedRect(margin + 2, yPosition - 2, contentWidth - 4, stripHeight, 1, 1, 'F');

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...RED);
          pdf.text(`  -  ${warningText}`, margin + 6, yPosition + 4);
          yPosition += 8;

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...GRAY_TEXT);
          reasonLines.forEach((line: string) => {
            checkPageBreak(6);
            pdf.text(line, margin + 10, yPosition);
            yPosition += 5.5;
          });
          yPosition += 4;
        });
      }

      // ── Milestone ────────────────────────────────────────────────
      if (data.milestone) {
        addSectionGap(8);
        checkPageBreak(40);

        // Gold background box
        pdf.setFillColor(255, 248, 225);
        const milestoneBoxH = 38;
        pdf.roundedRect(margin, yPosition, contentWidth, milestoneBoxH, 3, 3, 'F');

        // Gold left accent
        pdf.setFillColor(...GOLD);
        pdf.rect(margin, yPosition + 3, 3, milestoneBoxH - 6, 'F');

        yPosition += 10;
        pdf.setFontSize(12);
        pdf.setTextColor(...GOLD);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${data.milestone.timeframe || ''} Milestone`, margin + 10, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(...GRAY_TEXT);
        pdf.setFont('helvetica', 'normal');
        const goalLines = pdf.splitTextToSize(data.milestone.goal || '', contentWidth - 20);
        goalLines.forEach((line: string) => {
          pdf.text(line, margin + 10, yPosition);
          yPosition += 5.5;
        });
        yPosition += 5;
      }

    } catch (e) {
      console.error('Failed to parse Titan Roadmap JSON:', e);
      addNewPage();
      pdf.setFontSize(14);
      pdf.setTextColor(...RED);
      pdf.text('Error rendering Titan Roadmap', margin, yPosition);
    }
  };

  // ════════════════════════════════════════════════════════════════════
  //  VISUAL PLAYBOOK RENDERER
  // ════════════════════════════════════════════════════════════════════
  const renderVisualPlaybook = (title: string, content: string) => {
    try {
      const data = JSON.parse(content);

      addNewPage();

      // Page title
      pdf.setFontSize(20);
      pdf.setTextColor(...GOLD);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin, yPosition);
      yPosition += 14;

      addSectionDivider();
      addSectionGap(5);

      // ── Snapshot / Diagnosis ─────────────────────────────────────
      if (data.snapshot) {
        addSectionHeader('Current Situation', [235, 243, 255], DARK, 12);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...GRAY_TEXT);
        const diagLines = pdf.splitTextToSize(data.snapshot.diagnosis || '', contentWidth - 4);
        diagLines.forEach((line: string) => {
          checkPageBreak(6);
          pdf.text(line, margin + 2, yPosition);
          yPosition += 5.5;
        });
        addSectionGap(10);
        addSectionDivider();
        addSectionGap(5);
      }

      // ── Benchmarks ───────────────────────────────────────────────
      if (data.benchmarks) {
        addSectionHeader(data.benchmarks.title || 'Industry Benchmarks', [248, 250, 252], DARK, 12);

        if (data.benchmarks.metrics && Array.isArray(data.benchmarks.metrics)) {
          pdf.setFontSize(10);
          data.benchmarks.metrics.forEach((metric: any) => {
            checkPageBreak(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...GRAY_TEXT);
            const labelText = `${metric.label || ''}:`;
            pdf.text(labelText, margin + 4, yPosition);
            const labelWidth = pdf.getTextWidth(labelText);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...GOLD);
            pdf.text(metric.value || '', margin + 4 + labelWidth + 4, yPosition);
            yPosition += 6;

            if (metric.note || metric.context) {
              pdf.setTextColor(100, 100, 100);
              pdf.setFontSize(9);
              const noteText = metric.note || metric.context || '';
              const noteLines = pdf.splitTextToSize(noteText, contentWidth - 14);
              noteLines.forEach((line: string) => {
                checkPageBreak(5);
                pdf.text(line, margin + 8, yPosition);
                yPosition += 4.5;
              });
              pdf.setFontSize(10);
            }
            yPosition += 4;
          });
        }
        addSectionGap(10);
        addSectionDivider();
        addSectionGap(5);
      }

      // ── Weekly Plan ──────────────────────────────────────────────
      if (data.weeklyPlan && Array.isArray(data.weeklyPlan)) {
        addSectionHeader('Action Plan', [235, 243, 255], DARK, 12);

        data.weeklyPlan.forEach((week: any) => {
          // Ensure week header + at least 2 content lines
          checkPageBreak(22);

          pdf.setFontSize(11);
          pdf.setTextColor(...GOLD);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Week ${week.week}: ${week.title || ''}`, margin + 2, yPosition);
          yPosition += 7;

          if (week.description) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...GRAY_TEXT);
            const descLines = pdf.splitTextToSize(week.description, contentWidth - 10);
            descLines.forEach((line: string) => {
              checkPageBreak(6);
              pdf.text(line, margin + 8, yPosition);
              yPosition += 5.5;
            });
            yPosition += 3;
          }

          // Days (if structured with days)
          if (week.days && Array.isArray(week.days)) {
            pdf.setFontSize(10);
            week.days.forEach((day: any) => {
              checkPageBreak(14);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(...GRAY_TEXT);
              pdf.text(`${day.dayRange}: ${day.title || ''}`, margin + 8, yPosition);
              yPosition += 6;

              if (day.tasks && Array.isArray(day.tasks)) {
                pdf.setFont('helvetica', 'normal');
                day.tasks.forEach((task: string) => {
                  checkPageBreak(6);
                  const taskLines = pdf.splitTextToSize(`  -  ${task}`, contentWidth - 22);
                  taskLines.forEach((line: string) => {
                    pdf.text(line, margin + 14, yPosition);
                    yPosition += 5.5;
                  });
                });
              }
              yPosition += 3;
            });
          }

          // Tasks (if flat structure)
          if (week.tasks && Array.isArray(week.tasks) && !week.days) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...GRAY_TEXT);
            week.tasks.forEach((task: string) => {
              checkPageBreak(6);
              const taskLines = pdf.splitTextToSize(`  -  ${task}`, contentWidth - 14);
              taskLines.forEach((line: string) => {
                pdf.text(line, margin + 8, yPosition);
                yPosition += 5.5;
              });
            });
          }

          yPosition += 6;
        });
      }

      // ── Success Metrics ──────────────────────────────────────────
      if (data.successMetrics && Array.isArray(data.successMetrics)) {
        addSectionGap(5);
        addSectionDivider();
        addSectionGap(3);

        addSectionHeader('Success Metrics', [248, 250, 252], DARK, 12);

        pdf.setFontSize(10);
        data.successMetrics.forEach((metric: any) => {
          checkPageBreak(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...GRAY_TEXT);
          pdf.text(`  -  ${metric.metric || ''}`, margin + 4, yPosition);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...GOLD);
          pdf.text(metric.target || '', pageWidth - margin - 30, yPosition, { align: 'right' });
          yPosition += 7;
        });
        addSectionGap(5);
      }

      // ── Warnings ─────────────────────────────────────────────────
      if (data.warnings && Array.isArray(data.warnings)) {
        addSectionGap(5);
        checkPageBreak(30);

        addSectionHeader('Avoid These Mistakes', [254, 242, 242], RED, 12);

        data.warnings.forEach((warning: any) => {
          checkPageBreak(16);

          // Light red background strip
          const reasonText = warning.reason || '';
          const reasonLines = pdf.splitTextToSize(reasonText, contentWidth - 18);
          const stripHeight = 8 + reasonLines.length * 5.5;

          pdf.setFillColor(254, 249, 249);
          pdf.roundedRect(margin + 2, yPosition - 2, contentWidth - 4, stripHeight, 1, 1, 'F');

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...RED);
          pdf.text(`  -  ${warning.title || ''}`, margin + 6, yPosition + 4);
          yPosition += 8;

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...GRAY_TEXT);
          reasonLines.forEach((line: string) => {
            checkPageBreak(6);
            pdf.text(line, margin + 10, yPosition);
            yPosition += 5.5;
          });
          yPosition += 4;
        });
      }

      // ── Milestone ────────────────────────────────────────────────
      if (data.milestone) {
        addSectionGap(8);
        checkPageBreak(42);

        // Gold background box
        pdf.setFillColor(255, 248, 225);
        const milestoneBoxH = 40;
        pdf.roundedRect(margin, yPosition, contentWidth, milestoneBoxH, 3, 3, 'F');

        // Gold left accent
        pdf.setFillColor(...GOLD);
        pdf.rect(margin, yPosition + 3, 3, milestoneBoxH - 6, 'F');

        yPosition += 10;
        pdf.setFontSize(12);
        pdf.setTextColor(...GOLD);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${data.milestone.timeframe || ''} Goal`, margin + 10, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(...GRAY_TEXT);
        pdf.setFont('helvetica', 'normal');
        const goalLines = pdf.splitTextToSize(data.milestone.goal || '', contentWidth - 20);
        goalLines.forEach((line: string) => {
          pdf.text(line, margin + 10, yPosition);
          yPosition += 5.5;
        });
        yPosition += 5;
      }

    } catch (e) {
      console.error(`Failed to parse ${title} JSON:`, e);
      addNewPage();
      pdf.setFontSize(14);
      pdf.setTextColor(...RED);
      pdf.text(`Error rendering ${title}`, margin, yPosition);
    }
  };

  // ════════════════════════════════════════════════════════════════════
  //  RENDER ALL SECTIONS
  // ════════════════════════════════════════════════════════════════════

  // Titan Roadmap
  if (roadmap.titanRoadmap) {
    renderTitanRoadmap(roadmap.titanRoadmap);
  }

  // Bonus Playbooks
  const playbooks = [
    { title: 'Offer Optimization Playbook', content: roadmap.offerPlaybook },
    { title: 'Facebook Ads Strategy', content: roadmap.facebookAdLaunch },
    { title: 'Instagram Growth Plan', content: roadmap.instagramGrowth },
    { title: 'Lead Generation System', content: roadmap.leadGeneration },
  ];

  playbooks.forEach(playbook => {
    if (playbook.content) {
      renderVisualPlaybook(playbook.title, playbook.content);
    }
  });

  // Add footer to the last page
  addPageFooter();

  // Save the PDF
  const fileName = `${roadmap.businessName.replace(/\s+/g, '-')}-Health-Score-Report.pdf`;
  pdf.save(fileName);
}
