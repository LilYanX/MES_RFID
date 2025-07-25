"use client";

import React, { useState, useEffect } from "react";

interface AlertRule {
  _id?: string;
  name: string;
  description: string;
  type: "threshold" | "anomaly" | "system" | "security";
  condition: string;
  threshold_value?: number;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  notification_channels: string[];
  created_at?: string;
}

interface NotificationChannel {
  _id?: string;
  name: string;
  type: "email" | "sms" | "webhook" | "slack";
  config: Record<string, any>;
  enabled: boolean;
}

const ALERT_TYPES = [
  { value: "threshold", label: "Threshold Alert" },
  { value: "anomaly", label: "Anomaly Detection" },
  { value: "system", label: "System Alert" },
  { value: "security", label: "Security Alert" },
];

const SEVERITY_LEVELS = [
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

const AlertsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<"rules" | "channels">("rules");
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([]);
  
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [formRule, setFormRule] = useState<AlertRule>({
    name: "",
    description: "",
    type: "threshold",
    condition: "",
    threshold_value: 0,
    enabled: true,
    severity: "medium",
    notification_channels: [],
  });

  useEffect(() => {
    // Mock data
    const mockRules: AlertRule[] = [
      {
        _id: "1",
        name: "High RFID Read Rate",
        description: "Alert when RFID read rate exceeds threshold",
        type: "threshold",
        condition: "rfid_reads_per_minute > threshold",
        threshold_value: 100,
        enabled: true,
        severity: "medium",
        notification_channels: ["email_admin"],
        created_at: new Date().toISOString(),
      },
    ];
    setAlertRules(mockRules);

    const mockChannels: NotificationChannel[] = [
      {
        _id: "1",
        name: "Admin Email",
        type: "email",
        config: { email: "admin@company.com" },
        enabled: true,
      },
    ];
    setNotificationChannels(mockChannels);
  }, []);

  const getSeverityColor = (severity: string) => {
    const severityLevel = SEVERITY_LEVELS.find(s => s.value === severity);
    return severityLevel ? severityLevel.color : "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Alerts & Notifications</h2>
      
      {/* Sub-tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveSubTab("rules")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === "rules"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Alert Rules
          </button>
          <button
            onClick={() => setActiveSubTab("channels")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === "channels"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Notification Channels
          </button>
        </nav>
      </div>

      {/* Alert Rules Tab */}
      {activeSubTab === "rules" && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">Configure alert rules and conditions</p>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <span>+</span>
              Add Alert Rule
            </button>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alertRules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                        <div className="text-sm text-gray-500">{rule.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {rule.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(rule.severity)}`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Edit">✏️</button>
                        <button className="text-red-600 hover:text-red-900" title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notification Channels Tab */}
      {activeSubTab === "channels" && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">Configure notification channels</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              <span>+</span>
              Add Channel
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notificationChannels.map((channel) => (
              <div key={channel._id} className="bg-white rounded-xl shadow p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{channel.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900" title="Edit">✏️</button>
                    <button className="text-red-600 hover:text-red-900" title="Delete">🗑️</button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    channel.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {channel.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {channel.type === "email" && channel.config.email}
                  {channel.type === "sms" && channel.config.phone}
                  {channel.type === "slack" && channel.config.channel}
                  {channel.type === "webhook" && "Webhook configured"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsTab;
