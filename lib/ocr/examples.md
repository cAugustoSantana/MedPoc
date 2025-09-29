# OCR Service Examples

This document shows examples of how the OCR service handles both English and Spanish lab reports.

## English Lab Report Example

```
LABORATORY REPORT
Patient: John Doe
Date: 12/15/2024
Ordering Physician: Dr. Smith
Laboratory: City Medical Lab

Test Results:
Glucose 95 mg/dL (70-100)
Cholesterol 180 mg/dL (<200)
HDL 45 mg/dL (>40)
LDL 110 mg/dL (<100)
```

**Extracted Data:**

- Test Type: "Laboratory Report"
- Date: "12/15/2024"
- Physician: "Dr. Smith"
- Lab: "City Medical Lab"
- Results: Glucose (95 mg/dL, normal), Cholesterol (180 mg/dL, normal), etc.

## Spanish Lab Report Example

```
REPORTE DE LABORATORIO
Paciente: Juan Pérez
Fecha: 15/12/2024
Médico Ordenante: Dr. García
Laboratorio: Laboratorio Médico de la Ciudad

Resultados:
Glucosa 95 mg/dL (70-100)
Colesterol 180 mg/dL (<200)
HDL 45 mg/dL (>40)
LDL 110 mg/dL (<100)
```

**Extracted Data:**

- Test Type: "Reporte de Laboratorio"
- Date: "15/12/2024"
- Physician: "Dr. García"
- Lab: "Laboratorio Médico de la Ciudad"
- Results: Glucosa (95 mg/dL, normal), Colesterol (180 mg/dL, normal), etc.

## Mixed Language Support

The OCR service can handle reports that contain both English and Spanish terms:

```
LABORATORY REPORT / REPORTE DE LABORATORIO
Date / Fecha: 12/15/2024
Physician / Médico: Dr. Smith

Results / Resultados:
Glucose / Glucosa: 95 mg/dL (70-100)
Cholesterol / Colesterol: 180 mg/dL (<200)
```

## Supported Spanish Lab Parameters

The service recognizes common Spanish lab parameter names:

- **Glucosa** (Glucose)
- **Colesterol** (Cholesterol)
- **Hemoglobina** (Hemoglobin)
- **Hematocrito** (Hematocrit)
- **Leucocitos** (WBC)
- **Eritrocitos** (RBC)
- **Plaquetas** (Platelets)
- **Sodio** (Sodium)
- **Potasio** (Potassium)
- **Creatinina** (Creatinine)
- **Bilirrubina** (Bilirubin)
- **Proteína** (Protein)
- **Albúmina** (Albumin)

## Date Format Support

The service handles various date formats in both languages:

- **English**: 12/15/2024, 2024-12-15, December 15, 2024
- **Spanish**: 15/12/2024, 2024-12-15, 15 de diciembre de 2024

## Status Detection

The service automatically determines if values are normal, high, low, or critical based on reference ranges:

- **Normal**: Value within reference range
- **High**: Value above upper limit
- **Low**: Value below lower limit
- **Critical**: Values that require immediate attention

## Error Handling

The service provides helpful error messages in both languages:

- **English**: "No test data could be extracted from the file"
- **Spanish**: "No se pudieron extraer datos de prueba del archivo"

## Performance

- **Processing Time**: 2-5 seconds depending on file size
- **Accuracy**: High accuracy for both English and Spanish text
- **Confidence Scores**: Provided for quality assessment
- **Progress Tracking**: Real-time progress updates during processing
