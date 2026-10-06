"""Generates public/resume.pdf, the English one-page résumé linked from the site.

Run: python scripts/gen_resume.py   (requires: pip install reportlab)

Keep it in sync with src/data/content.ts when experience or projects change.
The phone number is left out on purpose: this PDF is publicly downloadable.
"""
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "resume.pdf"

INK = HexColor("#141414")
GRAY = HexColor("#565656")
BRASS = HexColor("#9C7A3E")
LINE = HexColor("#D9D6CE")

styles = getSampleStyleSheet()
name_style = ParagraphStyle("Name", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=21, leading=25, textColor=INK, spaceAfter=2)
role_style = ParagraphStyle("Role", parent=styles["Normal"], fontName="Helvetica", fontSize=10.5, textColor=BRASS, spaceAfter=3)
meta_style = ParagraphStyle("Meta", parent=styles["Normal"], fontName="Helvetica", fontSize=8.8, textColor=GRAY)
h2_style = ParagraphStyle("H2", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, textColor=INK, spaceBefore=8, spaceAfter=4)
body_style = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica", fontSize=9, textColor=INK, leading=12.6, alignment=TA_LEFT)
bullet_style = ParagraphStyle("Bullet", parent=body_style, leftIndent=9, bulletIndent=0, spaceAfter=1)
small_style = ParagraphStyle("Small", parent=styles["Normal"], fontName="Helvetica", fontSize=8.6, textColor=GRAY, leading=12)
date_style = ParagraphStyle("Date", parent=small_style, alignment=TA_RIGHT)
title_style = ParagraphStyle("Title", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9.6, textColor=INK, spaceAfter=1)

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=12 * mm,
    bottomMargin=11 * mm,
    title="Mohamed Reda Ghalbi | Résumé",
    author="Mohamed Reda Ghalbi",
)
CONTENT_W = doc.width - 12  # frame has 6pt padding on each side

story = []


def heading(text):
    story.append(Paragraph(text, h2_style))


def entry(title, org, date, bullets=(), note=None):
    left = f"{title} &nbsp;<font color='#9C7A3E'>· {org}</font>" if org else title
    row = Table(
        [[Paragraph(left, title_style), Paragraph(date, date_style)]],
        colWidths=[CONTENT_W - 38 * mm, 38 * mm],
    )
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    story.append(row)
    if note:
        story.append(Paragraph(note, small_style))
    for b in bullets:
        story.append(Paragraph(b, bullet_style, bulletText="•"))
    story.append(Spacer(1, 3.5))


story.append(Paragraph("Mohamed Reda Ghalbi", name_style))
story.append(Paragraph("AI &amp; Data Science Engineering Student", role_style))
story.append(Paragraph(
    "Casablanca, Morocco &nbsp;·&nbsp; ghalbimohamedreda@gmail.com &nbsp;·&nbsp; "
    "<link href='https://github.com/r0od3x'>github.com/r0od3x</link> &nbsp;·&nbsp; "
    "<link href='https://www.linkedin.com/in/mohamed-reda-ghalbi-941b1126b/'>linkedin.com/in/mohamed-reda-ghalbi-941b1126b</link>",
    meta_style,
))
story.append(Spacer(1, 7))
story.append(HRFlowable(width="100%", thickness=0.75, color=LINE))

heading("SUMMARY")
story.append(Paragraph(
    "Engineering student in Artificial Intelligence &amp; Data Science at EMSI Casablanca with hands-on "
    "experience in predictive modelling, data pipelines and intelligent systems in banking and industrial "
    "settings. I build ML end to end, from data preparation and model training to the APIs and apps that "
    "put predictions in front of users.",
    body_style,
))

heading("EXPERIENCE")
entry(
    "Data Science &amp; AI Intern", "Crédit du Maroc", "Jul – Aug 2026",
    [
        "Prepared, cleaned and transformed historical financial data for predictive modelling.",
        "Built a machine learning pipeline forecasting cash inflows and outflows.",
        "Engineered temporal lag features to improve forecasting performance.",
        "Contributed to the design of a decision-support system for budget tracking (Python, Pandas, Scikit-learn).",
    ],
)
entry(
    "Data &amp; AI Automation Intern", "GPC (Gharb Papier et Carton)", "Jul – Aug 2025",
    [
        "Automated ETL pipelines (PDF, Excel, XML, REST APIs to PostgreSQL) and a Tesseract OCR pipeline "
        "for production-data extraction; real-time analytics dashboards.",
        "Built a desktop app automating customs certificates: PDF/OCR extraction, FIFO allocation against "
        "the PostgreSQL declarations ledger, Excel/PDF generation.",
    ],
)
entry(
    "Data &amp; Analytics Intern", "FedEx", "Jul – Aug 2024",
    ["HR attendance analytics system (Flask + PostgreSQL) and automated HR KPI reporting via REST API."],
)

heading("PROJECTS")
entry(
    "NutriVision AI: Food Recognition &amp; Nutrition Estimation", "", "Jan – Mar 2026",
    [
        "Multi-task deep learning pipeline (EfficientNet-B3 + regression head) predicting calories, mass and "
        "macronutrients from a single image, with no external food database.",
        "MAE of 36.4 kcal on Nutrition5K, 17.3% better than Google Research's published baseline (44.0 kcal); "
        "FastAPI backend, Flutter app, LLM-generated nutrition coaching (Claude / GPT-4).",
    ],
)
entry(
    "MedAI: Multi-Agent Medical Pre-Consultation", "", "2026",
    ["LangGraph pipeline (orchestrator, triage, doctor validation, synthesis) with FastAPI backend and Streamlit UI."],
)
entry(
    "SugarSight: Diabetes Prediction Platform", "", "Apr 2025",
    ["End-to-end ML pipeline (Random Forest, ~81% test accuracy) with FastAPI backend and OpenAI-powered replies."],
)

heading("SKILLS")
skills = [
    ["Languages", "Python (advanced), SQL, JavaScript, HTML/CSS"],
    ["ML &amp; AI", "PyTorch, Scikit-learn, EfficientNet, ResNet, multi-task regression, LangGraph, LangChain, RAG, LLM APIs (Claude, GPT-4)"],
    ["Data", "Pandas, NumPy, ETL pipelines, OCR (Tesseract), Matplotlib, Seaborn, PostgreSQL, MongoDB"],
    ["Engineering", "FastAPI, Flask, REST APIs, React, Flutter, Git, Linux, Google Colab"],
]
t = Table([[Paragraph(f"<b>{k}</b>", body_style), Paragraph(v, body_style)] for k, v in skills],
          colWidths=[26 * mm, CONTENT_W - 26 * mm])
t.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 1.5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
]))
story.append(t)

heading("CERTIFICATIONS")
story.append(Paragraph(
    "<b>Deep Learning Specialization</b>, DeepLearning.AI, 2026 (5 courses: Neural Networks and Deep Learning · "
    "Improving Deep Neural Networks · Structuring ML Projects · CNNs · Sequence Models)",
    body_style,
))
story.append(Paragraph("<b>CS50x</b>, HarvardX, 2024 &nbsp;·&nbsp; <b>Agile Project Management</b>, Google", body_style))

heading("EDUCATION")
entry("Engineering Degree: Computer Science, AI &amp; Data Science", "EMSI Casablanca", "2022 – present")
entry("Baccalaureate in Physical Sciences", "", "2022")

heading("LANGUAGES &amp; ACTIVITIES")
story.append(Paragraph("<b>Languages:</b> Arabic (native) · French (fluent) · English (fluent) · German (beginner)", body_style))
story.append(Paragraph("<b>Judo:</b> 2nd place, Coupe du Trône (national), 2024 · Judo referee", body_style))
story.append(Paragraph("<b>Leadership:</b> Organizer, 11th EMSI Careers Forum (2025) · Class delegate, EMSI", body_style))

doc.build(story)
print(f"wrote {OUT}")
