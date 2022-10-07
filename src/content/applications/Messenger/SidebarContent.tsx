import { useState, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  List,
  Button,
  Tooltip,
  Divider,
  AvatarGroup,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  lighten,
  styled
} from '@mui/material';
import { formatDistance, subMinutes, subHours } from 'date-fns';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Label from 'src/components/Label';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import AlarmTwoToneIcon from '@mui/icons-material/AlarmTwoTone';
import { Link as RouterLink } from 'react-router-dom';
import authService from 'src/services/auth.service';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
          background-color: ${theme.colors.success.lighter};
          color: ${theme.colors.success.main};
          width: ${theme.spacing(8)};
          height: ${theme.spacing(8)};
          margin-left: auto;
          margin-right: auto;
    `
);

const MeetingBox = styled(Box)(
  ({ theme }) => `
          background-color: ${lighten(theme.colors.alpha.black[10], 0.5)};
          margin: ${theme.spacing(2)} 0;
          border-radius: ${theme.general.borderRadius};
          padding: ${theme.spacing(2)};
    `
);

const RootWrapper = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(2.5)};
  `
);

const ListItemWrapper = styled(ListItemButton)(
  ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
  `
);

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTabs-indicator {
            min-height: 4px;
            height: 4px;
            box-shadow: none;
            border: 0;
        }

        .MuiTab-root {
            &.MuiButtonBase-root {
                padding: 0;
                margin-right: ${theme.spacing(3)};
                font-size: ${theme.typography.pxToRem(16)};
                color: ${theme.colors.alpha.black[50]};

                .MuiTouchRipple-root {
                    display: none;
                }
            }

            &.Mui-selected:hover,
            &.Mui-selected {
                color: ${theme.colors.alpha.black[100]};
            }
        }
  `
);

function SidebarContent(props) {
  const user = authService.getCurrentUser();

  const [users, setUsers] = useState(props.users)

  const [state, setState] = useState({
    invisible: true
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };

  const joinPrivateRoom = (room: any) => {
    props.sendMessage(JSON.stringify({
      action: 'join-room-private',
      message: room.id
    }));
  }

  const [currentTab, setCurrentTab] = useState<string>('all');

  const tabs = [
    { value: 'all', label: 'Online' },
    // { value: 'unread', label: 'Unread' },
    // { value: 'archived', label: 'Archived' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <RootWrapper>
      <Typography
        sx={{
          mb: 1,
          mt: 2
        }}
        variant="h3"
      >
        Chats
      </Typography>

      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>

      <Box mt={2}>
        {currentTab === 'all' && (
          <List disablePadding component="div">
            {
              users.map((u,index) => {
                return (<ListItemWrapper key={index} onClick={() => joinPrivateRoom(u)}>
                <ListItemAvatar>
                  <Avatar src="/static/images/avatars/2.jpg" />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    mr: 1
                  }}
                  primaryTypographyProps={{
                    color: 'textPrimary',
                    variant: 'h5',
                    noWrap: true
                  }}
                  secondaryTypographyProps={{
                    color: 'textSecondary',
                    noWrap: true
                  }}
                  primary={u.Name}
                  secondary="Online"
                />
                </ListItemWrapper>)
              })
            }
          </List>
        )}
      </Box>
      <Box display="flex" pb={1} mt={4} alignItems="center" justifyContent={"space-between"}>
        <Typography
          sx={{
            mr: 1
          }}
          variant="h3"
        >
          Chat Room
        </Typography>
        <Button variant="contained" color="success" onClick={props.openPopup}>
          <b>+</b>
        </Button>
      </Box>
      {
        props.rooms.map((room,index) => {
          
          return (<MeetingBox key={index}>
          <Typography variant="h4">{room.private ? "Private_" + room.name : room.name}</Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* <AvatarGroup>
              <Tooltip arrow title="View profile for Remy Sharp">
                <Avatar
                  sx={{
                    width: 28,
                    height: 28
                  }}
                  component={RouterLink}
                  to="#"
                  alt="Remy Sharp"
                  src="/static/images/avatars/1.jpg"
                />
              </Tooltip>
              <Tooltip arrow title="View profile for Travis Howard">
                <Avatar
                  sx={{
                    width: 28,
                    height: 28
                  }}
                  component={RouterLink}
                  to="#"
                  alt="Travis Howard"
                  src="/static/images/avatars/2.jpg"
                />
              </Tooltip>
              <Tooltip arrow title="View profile for Craig Vaccaro">
                <Avatar
                  sx={{
                    width: 28,
                    height: 28
                  }}
                  component={RouterLink}
                  to="#"
                  alt="Craig Vaccaro"
                  src="/static/images/avatars/3.jpg"
                />
              </Tooltip>
            </AvatarGroup> */}
  
            <Button variant="contained" size="small" onClick={() => props.chooseRoom(room.id)}>
              Attend
            </Button>
          </Box>
        </MeetingBox>)
          
        })
      }
    </RootWrapper>
  );
}

export default SidebarContent;
