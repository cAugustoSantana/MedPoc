'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { toast } from 'sonner';
import { completeOnboardingAction } from './actions';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  User,
  Stethoscope,
  FileText,
  Loader2,
} from 'lucide-react';
import type { Role } from '@/db/queries/roles';
import type { DocumentType } from '@/db/queries/document-types';
import {
  onboardingSchema,
  type OnboardingFormData,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
} from '@/lib/validations/onboarding';

const steps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Role Selection', icon: User },
  { id: 3, title: 'Medical Specialty', icon: Stethoscope },
  { id: 4, title: 'Professional Details', icon: FileText },
];

interface OnboardingFormProps {
  roles: Role[];
  documentTypes: DocumentType[];
}

export function OnboardingForm({ roles, documentTypes }: OnboardingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      phone: '',
      role: '',
      specialty: '',
      documentType: '',
      documentNumber: '',
    },
    mode: 'onChange',
  });

  const formData = form.watch();

  const nextStep = async () => {
    if (currentStep < steps.length) {
      setValidating(true);
      let isValid = false;

      switch (currentStep) {
        case 1:
          const step1Result = validateStep1(formData);
          isValid = step1Result.success;
          if (!isValid) {
            Object.entries(step1Result.errors || {}).forEach(
              ([field, errors]) => {
                if (errors) {
                  form.setError(field as keyof OnboardingFormData, {
                    type: 'manual',
                    message: errors[0],
                  });
                }
              }
            );
          }
          break;
        case 2:
          const step2Result = validateStep2(formData);
          isValid = step2Result.success;
          if (!isValid) {
            Object.entries(step2Result.errors || {}).forEach(
              ([field, errors]) => {
                if (errors) {
                  form.setError(field as keyof OnboardingFormData, {
                    type: 'manual',
                    message: errors[0],
                  });
                }
              }
            );
          }
          break;
        case 3:
          const step3Result = validateStep3(formData);
          isValid = step3Result.success;
          if (!isValid) {
            Object.entries(step3Result.errors || {}).forEach(
              ([field, errors]) => {
                if (errors) {
                  form.setError(field as keyof OnboardingFormData, {
                    type: 'manual',
                    message: errors[0],
                  });
                }
              }
            );
          }
          break;
        case 4:
          const step4Result = validateStep4(formData);
          isValid = step4Result.success;
          if (!isValid) {
            Object.entries(step4Result.errors || {}).forEach(
              ([field, errors]) => {
                if (errors) {
                  form.setError(field as keyof OnboardingFormData, {
                    type: 'manual',
                    message: errors[0],
                  });
                }
              }
            );
          }
          break;
        default:
          isValid = false;
      }

      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
      setValidating(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.role !== '';
      case 3:
        return formData.specialty !== '';
      case 4:
        return (
          formData.documentType !== '' && formData.documentNumber.trim() !== ''
        );
      default:
        return false;
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setLoading(true);

    try {
      const result = await completeOnboardingAction(data);

      if (result.success) {
        toast.success('Profile setup completed successfully!');
        // Add a small delay to show the success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to complete onboarding');
        setLoading(false);
      }
    } catch (error) {
      toast.error('An error occurred during onboarding');
      console.error(error);
      setLoading(false);
    }
  };

  const getSelectedRoleName = () => {
    const selectedRole = roles.find(
      (role) => role.roleId.toString() === formData.role
    );
    return selectedRole?.name || 'Unknown Role';
  };

  const getSelectedDocumentTypeName = () => {
    const selectedDocumentType = documentTypes.find(
      (docType) => docType.documentTypeId.toString() === formData.documentType
    );
    return selectedDocumentType?.name || 'Unknown Document Type';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Your Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem
                          key={role.roleId}
                          value={role.roleId.toString()}
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Specialty *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="endocrinology">
                        Endocrinology
                      </SelectItem>
                      <SelectItem value="family_medicine">
                        Family Medicine
                      </SelectItem>
                      <SelectItem value="gastroenterology">
                        Gastroenterology
                      </SelectItem>
                      <SelectItem value="internal_medicine">
                        Internal Medicine
                      </SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="obstetrics_gynecology">
                        Obstetrics & Gynecology
                      </SelectItem>
                      <SelectItem value="oncology">Oncology</SelectItem>
                      <SelectItem value="ophthalmology">
                        Ophthalmology
                      </SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="urology">Urology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map((docType) => (
                          <SelectItem
                            key={docType.documentTypeId}
                            value={docType.documentTypeId.toString()}
                          >
                            {docType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Review Your Information
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Name:</strong> {formData.name}
                </p>
                <p>
                  <strong>Role:</strong> {getSelectedRoleName()}
                </p>
                <p>
                  <strong>Specialty:</strong> {formData.specialty}
                </p>
                <p>
                  <strong>Document:</strong> {getSelectedDocumentTypeName()} -{' '}
                  {formData.documentNumber}
                </p>
                {formData.phone && (
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Setting up your profile...
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Please wait while we complete your registration
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Welcome to MedPoc!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Let&apos;s set up your profile to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.id
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-500'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id
                            ? 'text-blue-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress
              value={(currentStep / steps.length) * 100}
              className="h-2"
            />
          </div>

          <Separator />

          {/* Step Content */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep() || validating}
                    >
                      {validating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        'Next'
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading || !validateCurrentStep()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting up your profile...
                        </>
                      ) : (
                        'Complete Setup'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
