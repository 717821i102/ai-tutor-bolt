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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const SessionHeader = ({ session, onSessionUpdate, }) => {
    const { isOpen, onOpen, onClose } = (0, react_2.useDisclosure)();
    const [title, setTitle] = (0, react_1.useState)(session.title);
    const [topic, setTopic] = (0, react_1.useState)(session.topic || '');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const toast = (0, react_2.useToast)();
    const handleSave = async () => {
        setIsLoading(true);
        try {
            await onSessionUpdate(session.id, {
                title: title.trim(),
                topic: topic.trim() || undefined,
            });
            toast({
                title: 'Session updated',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onClose();
        }
        catch (error) {
            toast({
                title: 'Failed to update session',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCancel = () => {
        setTitle(session.title);
        setTopic(session.topic || '');
        onClose();
    };
    return (<>
      <react_2.HStack justify="space-between" align="center">
        <react_2.HStack spacing={3}>
          <fi_1.FiMessageSquare />
          <react_2.Text fontWeight="bold" fontSize="lg" noOfLines={1}>
            {session.title}
          </react_2.Text>
          
          {session.lesson_id && (<react_2.Badge colorScheme="blue" variant="subtle" display="flex" alignItems="center">
              <fi_1.FiBook style={{ marginRight: '4px' }}/>
              Lesson Context
            </react_2.Badge>)}
          
          {session.topic && (<react_2.Badge colorScheme="purple" variant="outline">
              {session.topic}
            </react_2.Badge>)}
        </react_2.HStack>
        
        <react_2.IconButton aria-label="Edit session" icon={<fi_1.FiEdit />} size="sm" variant="ghost" onClick={onOpen}/>
      </react_2.HStack>

      <react_2.Modal isOpen={isOpen} onClose={handleCancel} size="md">
        <react_2.ModalOverlay />
        <react_2.ModalContent>
          <react_2.ModalHeader>Edit Conversation</react_2.ModalHeader>
          <react_2.ModalCloseButton />
          <react_2.ModalBody>
            <react_2.VStack spacing={4} align="stretch">
              <react_2.FormControl>
                <react_2.FormLabel>Title</react_2.FormLabel>
                <react_2.Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter conversation title" size="lg"/>
              </react_2.FormControl>
              
              <react_2.FormControl>
                <react_2.FormLabel>Topic (optional)</react_2.FormLabel>
                <react_2.Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Mathematics, Physics, Programming" size="lg"/>
              </react_2.FormControl>
            </react_2.VStack>
          </react_2.ModalBody>
          <react_2.ModalFooter>
            <react_2.Button variant="ghost" mr={3} onClick={handleCancel}>
              Cancel
            </react_2.Button>
            <react_2.Button colorScheme="brand" onClick={handleSave} isLoading={isLoading} loadingText="Saving..." isDisabled={!title.trim()}>
              Save Changes
            </react_2.Button>
          </react_2.ModalFooter>
        </react_2.ModalContent>
      </react_2.Modal>
    </>);
};
exports.default = SessionHeader;
//# sourceMappingURL=SessionHeader.js.map