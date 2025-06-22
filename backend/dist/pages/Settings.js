"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const api_1 = __importDefault(require("../services/api"));
const Settings = () => {
    const { colorMode, toggleColorMode } = (0, react_2.useColorMode)();
    const toast = (0, react_2.useToast)();
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const [settings, setSettings] = (0, react_1.useState)({
        learning_preferences: {
            difficulty_preference: 'adaptive',
            lesson_duration_preference: 30,
            daily_goal: 2,
            weekly_goal: 10,
            preferred_subjects: ['Mathematics', 'Physics'],
            learning_style: 'visual',
            ai_assistance_level: 'moderate',
        },
        notifications: {
            email_notifications: true,
            push_notifications: true,
            daily_reminders: true,
            weekly_progress_reports: true,
            achievement_notifications: true,
            lesson_recommendations: true,
            reminder_time: '09:00',
        },
        privacy: {
            profile_visibility: 'private',
            share_progress: false,
            data_collection: true,
            analytics_tracking: true,
        },
        accessibility: {
            font_size: 'medium',
            high_contrast: false,
            reduce_motion: false,
            screen_reader_support: false,
        },
        localization: {
            language: 'en',
            timezone: 'UTC',
            date_format: 'MM/DD/YYYY',
            time_format: '12h',
        },
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [hasChanges, setHasChanges] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        fetchSettings();
    }, []);
    const fetchSettings = async () => {
        try {
            const response = await api_1.default.get('/users/me/settings');
            setSettings(response.data);
        }
        catch (error) {
            console.warn('Failed to fetch settings, using defaults:', error);
        }
    };
    const saveSettings = async () => {
        setIsLoading(true);
        try {
            await api_1.default.put('/users/me/settings', settings);
            setHasChanges(false);
            toast({
                title: 'Settings saved',
                description: 'Your preferences have been updated successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Failed to save settings:', error);
            toast({
                title: 'Failed to save settings',
                description: 'Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateSetting = (path, value) => {
        setSettings(prev => {
            const newSettings = { ...prev };
            const keys = path.split('.');
            let current = newSettings;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            setHasChanges(true);
            return newSettings;
        });
    };
    const resetToDefaults = () => {
        setSettings({
            learning_preferences: {
                difficulty_preference: 'adaptive',
                lesson_duration_preference: 30,
                daily_goal: 2,
                weekly_goal: 10,
                preferred_subjects: [],
                learning_style: 'visual',
                ai_assistance_level: 'moderate',
            },
            notifications: {
                email_notifications: true,
                push_notifications: true,
                daily_reminders: true,
                weekly_progress_reports: true,
                achievement_notifications: true,
                lesson_recommendations: true,
                reminder_time: '09:00',
            },
            privacy: {
                profile_visibility: 'private',
                share_progress: false,
                data_collection: true,
                analytics_tracking: true,
            },
            accessibility: {
                font_size: 'medium',
                high_contrast: false,
                reduce_motion: false,
                screen_reader_support: false,
            },
            localization: {
                language: 'en',
                timezone: 'UTC',
                date_format: 'MM/DD/YYYY',
                time_format: '12h',
            },
        });
        setHasChanges(true);
    };
    return (<react_2.Container maxW="container.xl" py={8}>
      <react_2.VStack spacing={8} align="stretch">
        {/* Header */}
        <react_2.HStack justify="space-between" align="center">
          <react_2.VStack align="start" spacing={2}>
            <react_2.Heading as="h1" size="2xl" color="brand.600">
              Settings
            </react_2.Heading>
            <react_2.Text color="gray.600" fontSize="lg">
              Customize your learning experience
            </react_2.Text>
          </react_2.VStack>
          
          <react_2.HStack spacing={4}>
            <react_2.Button leftIcon={<fi_1.FiRefreshCw />} onClick={resetToDefaults} variant="outline">
              Reset to Defaults
            </react_2.Button>
            <react_2.Button leftIcon={<fi_1.FiSave />} onClick={saveSettings} colorScheme="brand" isLoading={isLoading} loadingText="Saving..." isDisabled={!hasChanges}>
              Save Changes
            </react_2.Button>
          </react_2.HStack>
        </react_2.HStack>

        {hasChanges && (<react_2.Alert status="info" borderRadius="lg">
            <react_2.AlertIcon />
            <react_2.AlertTitle mr={2}>Unsaved Changes</react_2.AlertTitle>
            <react_2.AlertDescription>
              You have unsaved changes. Don't forget to save your preferences.
            </react_2.AlertDescription>
          </react_2.Alert>)}

        <react_2.SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Learning Preferences */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiBook} color="brand.500"/>
                <react_2.Heading size="md">Learning Preferences</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <react_2.VStack spacing={6} align="stretch">
                <react_2.FormControl>
                  <react_2.FormLabel>Difficulty Preference</react_2.FormLabel>
                  <react_2.Select value={settings.learning_preferences.difficulty_preference} onChange={(e) => updateSetting('learning_preferences.difficulty_preference', e.target.value)}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="adaptive">Adaptive (Recommended)</option>
                  </react_2.Select>
                </react_2.FormControl>

                <react_2.FormControl>
                  <react_2.FormLabel>Preferred Lesson Duration</react_2.FormLabel>
                  <react_2.HStack>
                    <react_2.Slider value={settings.learning_preferences.lesson_duration_preference} onChange={(value) => updateSetting('learning_preferences.lesson_duration_preference', value)} min={15} max={120} step={15} flex={1}>
                      <react_2.SliderTrack>
                        <react_2.SliderFilledTrack />
                      </react_2.SliderTrack>
                      <react_2.SliderThumb />
                    </react_2.Slider>
                    <react_2.Text minW="60px">{settings.learning_preferences.lesson_duration_preference} min</react_2.Text>
                  </react_2.HStack>
                </react_2.FormControl>

                <react_2.SimpleGrid columns={2} spacing={4}>
                  <react_2.FormControl>
                    <react_2.FormLabel>Daily Goal</react_2.FormLabel>
                    <react_2.NumberInput value={settings.learning_preferences.daily_goal} onChange={(_, value) => updateSetting('learning_preferences.daily_goal', value)} min={1} max={10}>
                      <react_2.NumberInputField />
                      <react_2.NumberInputStepper>
                        <react_2.NumberIncrementStepper />
                        <react_2.NumberDecrementStepper />
                      </react_2.NumberInputStepper>
                    </react_2.NumberInput>
                  </react_2.FormControl>

                  <react_2.FormControl>
                    <react_2.FormLabel>Weekly Goal</react_2.FormLabel>
                    <react_2.NumberInput value={settings.learning_preferences.weekly_goal} onChange={(_, value) => updateSetting('learning_preferences.weekly_goal', value)} min={1} max={50}>
                      <react_2.NumberInputField />
                      <react_2.NumberInputStepper>
                        <react_2.NumberIncrementStepper />
                        <react_2.NumberDecrementStepper />
                      </react_2.NumberInputStepper>
                    </react_2.NumberInput>
                  </react_2.FormControl>
                </react_2.SimpleGrid>

                <react_2.FormControl>
                  <react_2.FormLabel>Learning Style</react_2.FormLabel>
                  <react_2.Select value={settings.learning_preferences.learning_style} onChange={(e) => updateSetting('learning_preferences.learning_style', e.target.value)}>
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="reading">Reading/Writing</option>
                  </react_2.Select>
                </react_2.FormControl>

                <react_2.FormControl>
                  <react_2.FormLabel>AI Assistance Level</react_2.FormLabel>
                  <react_2.Select value={settings.learning_preferences.ai_assistance_level} onChange={(e) => updateSetting('learning_preferences.ai_assistance_level', e.target.value)}>
                    <option value="minimal">Minimal - Let me figure it out</option>
                    <option value="moderate">Moderate - Guide me when needed</option>
                    <option value="extensive">Extensive - Help me every step</option>
                  </react_2.Select>
                </react_2.FormControl>
              </react_2.VStack>
            </react_2.CardBody>
          </react_2.Card>

          {/* Notifications */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiBell} color="brand.500"/>
                <react_2.Heading size="md">Notifications</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <react_2.VStack spacing={6} align="stretch">
                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="email-notifications" mb="0" flex={1}>
                    Email Notifications
                  </react_2.FormLabel>
                  <react_2.Switch id="email-notifications" isChecked={settings.notifications.email_notifications} onChange={(e) => updateSetting('notifications.email_notifications', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="push-notifications" mb="0" flex={1}>
                    Push Notifications
                  </react_2.FormLabel>
                  <react_2.Switch id="push-notifications" isChecked={settings.notifications.push_notifications} onChange={(e) => updateSetting('notifications.push_notifications', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="daily-reminders" mb="0" flex={1}>
                    Daily Study Reminders
                  </react_2.FormLabel>
                  <react_2.Switch id="daily-reminders" isChecked={settings.notifications.daily_reminders} onChange={(e) => updateSetting('notifications.daily_reminders', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="weekly-reports" mb="0" flex={1}>
                    Weekly Progress Reports
                  </react_2.FormLabel>
                  <react_2.Switch id="weekly-reports" isChecked={settings.notifications.weekly_progress_reports} onChange={(e) => updateSetting('notifications.weekly_progress_reports', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="achievements" mb="0" flex={1}>
                    Achievement Notifications
                  </react_2.FormLabel>
                  <react_2.Switch id="achievements" isChecked={settings.notifications.achievement_notifications} onChange={(e) => updateSetting('notifications.achievement_notifications', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl>
                  <react_2.FormLabel>Daily Reminder Time</react_2.FormLabel>
                  <react_2.Input type="time" value={settings.notifications.reminder_time} onChange={(e) => updateSetting('notifications.reminder_time', e.target.value)}/>
                </react_2.FormControl>
              </react_2.VStack>
            </react_2.CardBody>
          </react_2.Card>

          {/* Privacy & Security */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiShield} color="brand.500"/>
                <react_2.Heading size="md">Privacy & Security</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <react_2.VStack spacing={6} align="stretch">
                <react_2.FormControl>
                  <react_2.FormLabel>Profile Visibility</react_2.FormLabel>
                  <react_2.Select value={settings.privacy.profile_visibility} onChange={(e) => updateSetting('privacy.profile_visibility', e.target.value)}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </react_2.Select>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="share-progress" mb="0" flex={1}>
                    Share Progress with Community
                  </react_2.FormLabel>
                  <react_2.Switch id="share-progress" isChecked={settings.privacy.share_progress} onChange={(e) => updateSetting('privacy.share_progress', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="data-collection" mb="0" flex={1}>
                    Allow Data Collection for Improvement
                  </react_2.FormLabel>
                  <react_2.Switch id="data-collection" isChecked={settings.privacy.data_collection} onChange={(e) => updateSetting('privacy.data_collection', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="analytics-tracking" mb="0" flex={1}>
                    Analytics Tracking
                  </react_2.FormLabel>
                  <react_2.Switch id="analytics-tracking" isChecked={settings.privacy.analytics_tracking} onChange={(e) => updateSetting('privacy.analytics_tracking', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.Alert status="info" borderRadius="md" size="sm">
                  <react_2.AlertIcon />
                  <react_2.Text fontSize="sm">
                    We use this data to personalize your learning experience and improve our AI tutor.
                  </react_2.Text>
                </react_2.Alert>
              </react_2.VStack>
            </react_2.CardBody>
          </react_2.Card>

          {/* Appearance & Accessibility */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={colorMode === 'light' ? fi_1.FiSun : fi_1.FiMoon} color="brand.500"/>
                <react_2.Heading size="md">Appearance & Accessibility</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <react_2.VStack spacing={6} align="stretch">
                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="dark-mode" mb="0" flex={1}>
                    Dark Mode
                  </react_2.FormLabel>
                  <react_2.Switch id="dark-mode" isChecked={colorMode === 'dark'} onChange={toggleColorMode} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl>
                  <react_2.FormLabel>Font Size</react_2.FormLabel>
                  <react_2.Select value={settings.accessibility.font_size} onChange={(e) => updateSetting('accessibility.font_size', e.target.value)}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </react_2.Select>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="high-contrast" mb="0" flex={1}>
                    High Contrast Mode
                  </react_2.FormLabel>
                  <react_2.Switch id="high-contrast" isChecked={settings.accessibility.high_contrast} onChange={(e) => updateSetting('accessibility.high_contrast', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="reduce-motion" mb="0" flex={1}>
                    Reduce Motion
                  </react_2.FormLabel>
                  <react_2.Switch id="reduce-motion" isChecked={settings.accessibility.reduce_motion} onChange={(e) => updateSetting('accessibility.reduce_motion', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>

                <react_2.FormControl display="flex" alignItems="center">
                  <react_2.FormLabel htmlFor="screen-reader" mb="0" flex={1}>
                    Screen Reader Support
                  </react_2.FormLabel>
                  <react_2.Switch id="screen-reader" isChecked={settings.accessibility.screen_reader_support} onChange={(e) => updateSetting('accessibility.screen_reader_support', e.target.checked)} colorScheme="brand"/>
                </react_2.FormControl>
              </react_2.VStack>
            </react_2.CardBody>
          </react_2.Card>
        </react_2.SimpleGrid>

        {/* Language & Region */}
        <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
          <react_2.CardHeader>
            <react_2.HStack>
              <react_2.Icon as={fi_1.FiGlobe} color="brand.500"/>
              <react_2.Heading size="md">Language & Region</react_2.Heading>
            </react_2.HStack>
          </react_2.CardHeader>
          <react_2.CardBody>
            <react_2.SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              <react_2.FormControl>
                <react_2.FormLabel>Language</react_2.FormLabel>
                <react_2.Select value={settings.localization.language} onChange={(e) => updateSetting('localization.language', e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                </react_2.Select>
              </react_2.FormControl>

              <react_2.FormControl>
                <react_2.FormLabel>Timezone</react_2.FormLabel>
                <react_2.Select value={settings.localization.timezone} onChange={(e) => updateSetting('localization.timezone', e.target.value)}>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </react_2.Select>
              </react_2.FormControl>

              <react_2.FormControl>
                <react_2.FormLabel>Date Format</react_2.FormLabel>
                <react_2.Select value={settings.localization.date_format} onChange={(e) => updateSetting('localization.date_format', e.target.value)}>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </react_2.Select>
              </react_2.FormControl>

              <react_2.FormControl>
                <react_2.FormLabel>Time Format</react_2.FormLabel>
                <react_2.Select value={settings.localization.time_format} onChange={(e) => updateSetting('localization.time_format', e.target.value)}>
                  <option value="12h">12 Hour</option>
                  <option value="24h">24 Hour</option>
                </react_2.Select>
              </react_2.FormControl>
            </react_2.SimpleGrid>
          </react_2.CardBody>
        </react_2.Card>

        {/* Save Button */}
        <react_2.HStack justify="center" pt={4}>
          <react_2.Button leftIcon={<fi_1.FiSave />} onClick={saveSettings} colorScheme="brand" size="lg" isLoading={isLoading} loadingText="Saving Settings..." isDisabled={!hasChanges}>
            Save All Settings
          </react_2.Button>
        </react_2.HStack>
      </react_2.VStack>
    </react_2.Container>);
};
exports.default = Settings;
//# sourceMappingURL=Settings.js.map