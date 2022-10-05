import {
  Avatar,
  Tooltip,
  IconButton,
  Box,
  Button,
  styled,
  InputBase,
  useTheme
} from '@mui/material';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { useState } from 'react';
import authService from 'src/services/auth.service';

const MessageInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`
);

const Input = styled('input')({
  display: 'none'
});

function BottomBarContent(props) {
  const theme = useTheme();

  const user =  authService.getCurrentUser();
  
  const [message, setMessage] = useState("");

  const handleSendMessage = (event) => {
    if(event.keyCode === 13) {
      props.sendMessage(JSON.stringify({
        action: 'send-message',
        message: message,
        target: {
          id: props.roomInfo.id,
          name: props.roomInfo.name,
          private: props.roomInfo.private
        }
      }));
      setMessage("");
    }
  }

  const handleClickSendMessage = () => {
    props.sendMessage(JSON.stringify({
      action: 'send-message',
      message: message,
      target: {
        id: props.roomInfo.id,
        name: props.roomInfo.name,
        private: props.roomInfo.private
      }
    }));
    setMessage("");
  }

  return (
    <Box
      sx={{
        background: theme.colors.alpha.white[50],
        display: 'flex',
        alignItems: 'center',
        p: 2
      }}
    >
      <Box flexGrow={1} display="flex" alignItems="center">
        <Avatar
          sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }}
          alt={user.name}
          src={user.avatar}
        />
        <MessageInputWrapper
          autoFocus
          placeholder="Write your message here..."
          fullWidth
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </Box>
      <Box>
        <Tooltip arrow placement="top" title="Choose an emoji">
          <IconButton
            sx={{ fontSize: theme.typography.pxToRem(16) }}
            color="primary"
          >
            😀
          </IconButton>
        </Tooltip>
        <Input accept="image/*" id="messenger-upload-file" type="file" />
        <Tooltip arrow placement="top" title="Attach a file">
          <label htmlFor="messenger-upload-file">
            <IconButton sx={{ mx: 1 }} color="primary" component="span">
              <AttachFileTwoToneIcon fontSize="small" />
            </IconButton>
          </label>
        </Tooltip>
        <Button onClick={handleClickSendMessage} startIcon={<SendTwoToneIcon />} variant="contained">
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default BottomBarContent;
