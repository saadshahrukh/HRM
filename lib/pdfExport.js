import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";

/**
 * Generate PDF report for interview feedback
 */
export const generateInterviewPDF = async (feedbackData, candidateInfo) => {
  const feedback = feedbackData?.feedback || {};
  const ratings = feedback?.rating || {};
  const summary = feedback?.summery || "No summary available.";
  const recommendation = feedback?.Recommendation || "No";
  const recommendationMsg = feedback?.RecommendationMsg || "";

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: "Interview Report",
            heading: HeadingLevel.TITLE,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Candidate: ${candidateInfo?.userName || "Unknown"}`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Email: ${candidateInfo?.userEmail || "N/A"}`,
            spacing: { after: 400 },
          }),

          // Skills Assessment
          new Paragraph({
            text: "Skills Assessment",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Skill")],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph("Rating (out of 10)")],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Technical Skills")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        String(ratings?.techicalSkills || 0)
                      ),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Communication")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(String(ratings?.communication || 0)),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Problem Solving")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(String(ratings?.problemSolving || 0)),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Experience")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(String(ratings?.experince || 0)),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Summary
          new Paragraph({
            text: "Summary",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: summary,
            spacing: { after: 400 },
          }),

          // Recommendation
          new Paragraph({
            text: "Recommendation",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: `Recommendation: ${recommendation}`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: recommendationMsg,
            spacing: { after: 400 },
          }),

          // Behavioral Analysis
          ...(feedback?.behavioralAnalysis
            ? [
                new Paragraph({
                  text: "Behavioral Analysis",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                }),
                new Paragraph({
                  text: `Confidence: ${feedback.behavioralAnalysis.confidence || "N/A"}`,
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  text: `Stress Level: ${feedback.behavioralAnalysis.stressLevel || "N/A"}`,
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  text: `Engagement: ${feedback.behavioralAnalysis.engagement || "N/A"}`,
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  text: `Eye Contact: ${feedback.behavioralAnalysis.eyeContact || "N/A"}`,
                  spacing: { after: 400 },
                }),
              ]
            : []),

          // Strengths and Areas of Development
          ...(feedback?.summaryDetails
            ? [
                new Paragraph({
                  text: "Strengths",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                }),
                ...(feedback.summaryDetails.strengths || []).map(
                  (strength) =>
                    new Paragraph({
                      text: `• ${strength}`,
                      spacing: { after: 100 },
                    })
                ),
                new Paragraph({
                  text: "Areas of Development",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                }),
                ...(feedback.summaryDetails.areasOfDevelopment || []).map(
                  (area) =>
                    new Paragraph({
                      text: `• ${area}`,
                      spacing: { after: 100 },
                    })
                ),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
};

/**
 * Download PDF report
 */
export const downloadInterviewPDF = async (feedbackData, candidateInfo, fileName) => {
  try {
    const blob = await generateInterviewPDF(feedbackData, candidateInfo);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || `interview-report-${candidateInfo?.userName || "candidate"}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw error;
  }
};

