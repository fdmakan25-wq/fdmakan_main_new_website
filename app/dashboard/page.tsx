'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import AnalyticsTab from '@/components/dashboard/AnalyticsTab';
import PropertiesTab from '@/components/dashboard/PropertiesTab';
import OrdersTab from '@/components/dashboard/OrdersTab';
import DevelopersTab from '@/components/dashboard/DevelopersTab';
import BlogsTab from '@/components/dashboard/BlogsTab';
import BannersTab from '@/components/dashboard/BannersTab';
import LocationsTab from '@/components/dashboard/LocationsTab';
import CustomersTab from '@/components/dashboard/CustomersTab';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsTab />;
      case 'properties':
        return <PropertiesTab />;
      case 'orders':
        return <OrdersTab />;
      case 'developers':
        return <DevelopersTab />;
      case 'blogs':
        return <BlogsTab />;
      case 'banners':
        return <BannersTab />;
      case 'locations':
        return <LocationsTab />;
      case 'customers':
        return <CustomersTab />;
      default:
        return <AnalyticsTab />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </DashboardLayout>
  );
}

