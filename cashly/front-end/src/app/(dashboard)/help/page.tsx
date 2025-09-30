'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import {
    Search,
    BookOpen,
    MessageCircle,
    Mail,
    Phone,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            question: 'How do I add a new account?',
            answer: 'To add a new account, go to the Accounts page and click the "Add Account" button. Fill in the account name and initial balance, then click "Create Account".'
        },
        {
            question: 'Can I export my transaction history?',
            answer: 'Yes! Go to Settings > Data Management and choose your preferred export format (CSV, JSON, or PDF). Your data will be downloaded to your device.'
        },
        {
            question: 'How do I categorize my transactions?',
            answer: 'When adding a transaction, select a category from the dropdown menu. You can create custom categories in the Categories page.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Absolutely. We use industry-standard encryption to protect your data. You can also enable two-factor authentication in Settings > Security for extra protection.'
        },
        {
            question: 'Can I use multiple currencies?',
            answer: 'Yes, Cashly supports multiple currencies. You can set your default currency in Settings > Preferences, and each account can have its own currency.'
        },
        {
            question: 'How do I delete a transaction?',
            answer: 'Navigate to the Transactions page, find the transaction you want to delete, click on the three-dot menu, and select "Delete". Confirm the deletion in the dialog that appears.'
        },
    ];

    const guides = [
        {
            title: 'Getting Started with Cashly',
            description: 'Learn the basics of managing your finances',
            icon: '🚀',
            link: '#'
        },
        {
            title: 'Creating and Managing Budgets',
            description: 'Set up budgets to control your spending',
            icon: '💰',
            link: '#'
        },
        {
            title: 'Understanding Analytics',
            description: 'Make sense of your financial data',
            icon: '📊',
            link: '#'
        },
        {
            title: 'Import and Export Guide',
            description: 'Move your data in and out of Cashly',
            icon: '📦',
            link: '#'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
                <p className="text-muted-foreground">
                    Find answers and learn how to use Cashly
                </p>
            </div>

            {/* Search Bar */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for help..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button>Search</Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="faq" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="guides">Guides</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="faq" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                            <CardDescription>Quick answers to common questions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="guides" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {guides.map((guide, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{guide.icon}</span>
                                            <div>
                                                <CardTitle className="text-lg">{guide.title}</CardTitle>
                                                <CardDescription>{guide.description}</CardDescription>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                <CardTitle>Documentation</CardTitle>
                            </div>
                            <CardDescription>
                                Comprehensive guides and API documentation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full justify-between">
                                View Full Documentation
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    <CardTitle>Live Chat</CardTitle>
                                </div>
                                <CardDescription>Chat with our support team</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-4">Available Monday to Friday, 9 AM - 6 PM CET</p>
                                <Button className="w-full">Start Chat</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    <CardTitle>Email Support</CardTitle>
                                </div>
                                <CardDescription>Get help via email</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-4">{`We'll respond within 24 hours`}</p>
                                <Button variant="outline" className="w-full">
                                    support@cashly.app
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Still need help?</CardTitle>
                            <CardDescription>
                                {`Send us a message and we'll get back to you as soon as possible`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Your name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="your@email.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="What do you need help with?" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Describe your issue or question..."
                                        className="min-h-[120px]"
                                    />
                                </div>
                                <Button type="submit">Send Message</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
