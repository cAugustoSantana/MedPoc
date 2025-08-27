import { getAllRoles } from '@/db/queries/roles';
import { getAllDocumentTypes } from '@/db/queries/document-types';
import { OnboardingForm } from '@/app/onboarding/onboarding-form';

export default async function OnboardingPage() {
  let roles = [];
  let documentTypes = [];

  try {
    // Fetch roles and document types from database
    [roles, documentTypes] = await Promise.all([
      getAllRoles(),
      getAllDocumentTypes(),
    ]);
  } catch (error) {
    console.error('Error fetching data for onboarding:', error);

    // Fallback to default data if database query fails
    roles = [
      { roleId: 1, name: 'Doctor', uuid: null, createdAt: null },
      { roleId: 2, name: 'Medical Assistant', uuid: null, createdAt: null },
    ];

    documentTypes = [
      {
        documentTypeId: 1,
        name: 'Passport',
        uuid: '8f8741f6-26b3-4f62-8189-6382d2d3ae85',
        createdAt: null,
      },
      {
        documentTypeId: 2,
        name: 'National ID',
        uuid: '8af82716-ff15-437d-adb1-ffaae406272f',
        createdAt: null,
      },
      {
        documentTypeId: 3,
        name: 'License',
        uuid: null,
        createdAt: null,
      },
    ];
  }

  return <OnboardingForm roles={roles} documentTypes={documentTypes} />;
}
