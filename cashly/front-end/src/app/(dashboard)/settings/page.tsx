'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, Bell, Shield, Palette, Globe, Smartphone, Download, Trash2 } from 'lucide-react';
import { CURRENCIES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [currency, setCurrency] = useState('EUR');
    const [language, setLanguage] = useState('en');

    const handleSaveProfile = () => {
        toast.success('Profile updated successfully');
    };

    const handleChangePassword = () => {
        toast.success('Password changed successfully');
    };

    const handleExportData = () => {
        toast.success('Data export started. You will receive an email when ready.');
    };

    const handleDeleteAccount = () => {
        toast.error('Account deletion requires confirmation via email');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                <CardTitle>Profile Information</CardTitle>
                            </div>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user?.email} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input id="name" placeholder="Enter your name" />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+39 123 456 7890" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select defaultValue="it">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="it">Italy</SelectItem>
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="de">Germany</SelectItem>
                                            <SelectItem value="fr">France</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleSaveProfile}>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                <CardTitle>Notification Preferences</CardTitle>
                            </div>
                            <CardDescription>Choose how you want to be notified</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="email-notifications">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications via email
                                        </p>
                                    </div>
                                    <Switch
                                        id="email-notifications"
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="push-notifications">Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive push notifications on your device
                                        </p>
                                    </div>
                                    <Switch
                                        id="push-notifications"
                                        checked={pushNotifications}
                                        onCheckedChange={setPushNotifications}
                                    />
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>Notification Types</Label>
                                    <div className="space-y-2">
                                        <NotificationOption label="Transaction alerts" defaultChecked />
                                        <NotificationOption label="Budget warnings" defaultChecked />
                                        <NotificationOption label="Weekly summaries" />
                                        <NotificationOption label="Monthly reports" defaultChecked />
                                        <NotificationOption label="Security alerts" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                <CardTitle>Security Settings</CardTitle>
                            </div>
                            <CardDescription>Keep your account secure</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-3">Change Password</h3>
                                    <div className="space-y-3">
                                        <Input type="password" placeholder="Current password" />
                                        <Input type="password" placeholder="New password" />
                                        <Input type="password" placeholder="Confirm new password" />
                                        <Button onClick={handleChangePassword}>Update Password</Button>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Add an extra layer of security to your account
                                        </p>
                                    </div>
                                    <Switch
                                        id="two-factor"
                                        checked={twoFactor}
                                        onCheckedChange={setTwoFactor}
                                    />
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-medium mb-2">Active Sessions</h3>
                                    <div className="space-y-2">
                                        <SessionItem
                                            device="Chrome on Windows"
                                            location="Milan, Italy"
                                            current
                                        />
                                        <SessionItem
                                            device="Safari on iPhone"
                                            location="Rome, Italy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                <CardTitle>App Preferences</CardTitle>
                            </div>
                            <CardDescription>Customize your experience</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CURRENCIES.map((curr) => (
                                                <SelectItem key={curr.value} value={curr.value}>
                                                    {curr.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="it">Italiano</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                            <SelectItem value="fr">Français</SelectItem>
                                            <SelectItem value="de">Deutsch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <Label>Display Options</Label>
                                <div className="space-y-2">
                                    <NotificationOption label="Show account balance on dashboard" defaultChecked />
                                    <NotificationOption label="Compact view for transactions" />
                                    <NotificationOption label="Show category icons" defaultChecked />
                                    <NotificationOption label="Group transactions by date" defaultChecked />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                <CardTitle>Data Management</CardTitle>
                            </div>
                            <CardDescription>Export or delete your data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Export Data</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Download all your data in a portable format
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={handleExportData}>
                                            Export as CSV
                                        </Button>
                                        <Button variant="outline" onClick={handleExportData}>
                                            Export as JSON
                                        </Button>
                                        <Button variant="outline" onClick={handleExportData}>
                                            Export as PDF
                                        </Button>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Permanently delete your account and all associated data
                                    </p>
                                    <Button variant="destructive" onClick={handleDeleteAccount}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function NotificationOption({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" defaultChecked={defaultChecked} className="rounded" />
            <span className="text-sm">{label}</span>
        </label>
    );
}

function SessionItem({ device, location, current = false }: { device: string; location: string; current?: boolean }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4" />
                <div>
                    <p className="text-sm font-medium">{device}</p>
                    <p className="text-xs text-muted-foreground">{location}</p>
                </div>
            </div>
            {current ? (
                <Badge variant="outline">Current</Badge>
            ) : (
                <Button variant="ghost" size="sm">End Session</Button>
            )}
        </div>
    );
}
