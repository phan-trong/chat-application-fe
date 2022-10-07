import React, { useState, useEffect } from 'react';

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
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import authService from 'src/services/auth.service';
import { Room } from 'src/models/room';

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
const socket = new WebSocket(`ws://localhost:8080/ws?id=${user.id}&token=${localStorage.getItem("token")}`);

export default function ApplicationsMessenger() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [chatHistory, setChatHistory] = useState([]);
  const [room, setRoom] = useState<any>();
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if(roomName != "") {
      socket.send(JSON.stringify({ action: 'join-room', message: roomName }));
      setRoomName("");
    }
    setOpen(false);
  };

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

  useEffect(()=> {
    connect((msg) => {
      console.log("New Message: ", msg.data)
      handleNewMessage(msg)
    });
  }, [users.length, room]);

  const handleNewMessage = async (event) => {
    let data = event.data;
      data = data.split(/\r?\n/);
      for (let i = 0; i < data.length; i++) {
        let msg = JSON.parse(data[i]);
        switch (msg.action) {
          case "send-message":
            handleChatMessage(msg);
            break;
          case "user-join":
            await handleUserJoined(msg);
            break;
          case "user-left":
            handleUserLeft(msg);
            break;
          case "room-joined":
            handleRoomJoined(msg);
            break;
          case "join-room":
            
            break;
          default:
            break;
        }
      }
  }

  const handleChatMessage = (msg) => {
    findRoom(msg.target.id);

    const roomTmp = {...room}
    roomTmp.messages.push(msg)
    setRoom(roomTmp)
  }

  const findRoom = (roomId) => {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomId) {
        setRoom(rooms[i]);
      }
    }
  }

  const handleRoomJoined = (msg) => {
    let room = {
      ...msg.target,
      name: msg.target.private ? msg.target.name : msg.target.name,
      messages: [],
    };
    
    setRooms((rooms) => [
      ...rooms,
      room
    ])

    setRoom(room);

    console.log(rooms)
  }

  const handleUserJoined = (msg) => {
    let isExists = false;
    for (let i = 0; i < users.length; i++) {
      if(users[i].id == msg.sender.id) {
        isExists = true;
      }
    }
    if(!isExists) {
      setUsers((users)=> [
        ...users,
        {
          ...msg.sender
        }
      ])
    }
  }

  const handleUserLeft = (msg) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == msg.sender.id) {
        users.splice(i, 1);
      }
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChooseRoom = (roomId) => {
    console.log(rooms);
    findRoom(roomId);
  }

  const setRoomNameValue = (event) => {
    setRoomName(event.target.value);
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Messenger - Applications</title>
      </Helmet>
      <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Room Name</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={setRoomNameValue}
          />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button onClick={handleClose}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
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
            <SidebarContent key={users} users={users} rooms={rooms} sendMessage={sendMsg} chooseRoom={handleChooseRoom} openPopup={handleClickOpen} closePopup={handleClose}/>
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
                <ChatContent chatHistory={room.messages} />
              </Scrollbar>
            </Box>
            <Divider />
            <BottomBarContent sendMessage={sendMsg} roomInfo={room}/>
          </ChatWindow>
        }
      </RootWrapper>
    </React.Fragment>
  );
}

