import DetailedStaffProfileClient from './StaffDetailClient';

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function DetailedStaffProfilePage() {
  return <DetailedStaffProfileClient />;
}
