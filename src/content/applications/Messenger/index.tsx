import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import TopBarContent from './TopBarContent';
import BottomBarContent from './BottomBarContent';
import SidebarContent from './SidebarContent';
import ChatContent from './ChatContent';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

import Scrollbar from 'src/components/Scrollbar';

import {
  Box,
  styled,
  Divider,
  Drawer,
  IconButton,
  useTheme
} from '@mui/material';
import authService from 'src/services/auth.service';

const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display: flex;
`
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 300px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(2)};
        align-items: center;
`
);

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  background: ${theme.colors.alpha.white[100]};
`
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`
);

const user = authService.getCurrentUser();
const socket = new WebSocket(`ws://localhost:8080/ws?id=${user.id}`);

export default function ApplicationsMessenger() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [room, setRoom] = useState<any>();
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([])

  let connect = cb => {
    console.log("Attempting Connection...");
  
    socket.onopen = () => {
      console.log("Successfully Connected");
    };
  
    socket.onmessage = msg => {
      console.log(msg);
      cb(msg);
    };
  
    socket.onclose = event => {
      console.log("Socket Closed Connection: ", event);
    };
  
    socket.onerror = error => {
      console.log("Socket Error: ", error);
    };
  };
  
  const sendMsg = msg => {
    console.log("sending msg: ", msg);
    socket.send(msg);
  };

  useEffect(() => {
    connect((msg) => {
      console.log("New Message: ", msg.data)
      handleNewMessage(msg)
      // setChatHistory([
      //   ...chatHistory, msg.data
      // ])
    });
  }, [users, room]);

  const handleNewMessage = (event) => {
    let data = event.data;
      data = data.split(/\r?\n/);
      for (let i = 0; i < data.length; i++) {
        let msg = JSON.parse(data[i]);
        switch (msg.action) {
          case "send-message":
            handleChatMessage(msg);
            break;
          case "user-join":
            handleUserJoined(msg);
            break;
          case "user-left":
            handleUserLeft(msg);
            break;
          case "room-joined":
            handleRoomJoined(msg);
            break;
          default:
            break;
        }
      }
  }

  const handleChatMessage = (msg) => {
    // findRoom(msg.target.id);
    // if(typeof room !== "undefined") {
    //   room.messages.push(msg);
    // }
    const roomTmp = {...room}
    roomTmp.messages.push(msg)
    setRoom(roomTmp)
    console.log(roomTmp)
  }
  
  const handleUserJoined = (msg) => {
    console.log(msg.sender)
    setUsers([...users,msg.sender])
  }

  const handleUserLeft = (msg) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == msg.sender.id) {
        users.splice(i, 1);
      }
    }
  }

  const findRoom = (roomId) => {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomId) {
        setRoom(rooms[i]);
      }
    }
  }

  const handleRoomJoined = (msg) => {
    setRoom({
      ...msg.target,
      name: msg.target.private ? msg.target.name : msg.sender.Name,
      messages: []
    });
    // Todo: View List Room
    // this.rooms.push(room);
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Helmet>
        <title>Messenger - Applications</title>
      </Helmet>
      <RootWrapper className="Mui-FixedWrapper">
        <DrawerWrapperMobile
          sx={{
            display: { lg: 'none', xs: 'inline-block' }
          }}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          <Scrollbar>
            <SidebarContent />
          </Scrollbar>
        </DrawerWrapperMobile>
        <Sidebar
          sx={{
            display: { xs: 'none', lg: 'inline-block' }
          }}
        >
          <Scrollbar>
            <SidebarContent users={users} sendMessage={sendMsg} />
          </Scrollbar>
        </Sidebar>
        {
          room == null ? 
          <ChatWindow></ChatWindow> : 
          <ChatWindow>
            <ChatTopBar
              sx={{
                display: { xs: 'flex', lg: 'inline-block' }
              }}
            >
              <IconButtonToggle
                sx={{
                  display: { lg: 'none', xs: 'flex' },
                  mr: 2
                }}
                color="primary"
                onClick={handleDrawerToggle}
                size="small"
              >
                <MenuTwoToneIcon />
              </IconButtonToggle>
              <TopBarContent roomInfo={room} />
            </ChatTopBar>
            <Box flex={1}>
              <Scrollbar>
                <ChatContent chatHistory={typeof room !== "undefined" ? room?.messages : []} />
              </Scrollbar>
            </Box>
            <Divider />
            <BottomBarContent sendMessage={sendMsg} roomInfo={room}/>
          </ChatWindow>
        }
      </RootWrapper>
    </>
  );
}

