import { Box, Avatar, Typography, Card, styled, Divider } from '@mui/material';
import { useRef, useEffect } from 'react';

import {
  formatDistance,
  format,
  subDays,
  subHours,
  subMinutes
} from 'date-fns';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
      .MuiDivider-wrapper {
        border-radius: ${theme.general.borderRadiusSm};
        text-transform: none;
        background: ${theme.palette.background.default};
        font-size: ${theme.typography.pxToRem(13)};
        color: ${theme.colors.alpha.black[50]};
      }
`
);

const CardWrapperPrimary = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-right-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

const CardWrapperSecondary = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.alpha.black[10]};
      color: ${theme.colors.alpha.black[100]};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-left-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

function ChatContent(props) {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };

  const messageRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  })

  return (
    <Box p={3} ref={messageRef}>
      <DividerWrapper>
        {format(subDays(new Date(), 3), 'MMMM dd yyyy')}
      </DividerWrapper>
      {props.chatHistory.map((msg, index) => {
                return (
                  
                  <Box
                  key={index}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                  py={3}
                >
                  <Box
                    display="flex"
                    alignItems="flex-end"
                    flexDirection="column"
                    justifyContent="flex-end"
                    mr={2}
                  >
                    <CardWrapperPrimary>
                      {msg}
                    </CardWrapperPrimary>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        pt: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ScheduleTwoToneIcon
                        sx={{
                          mr: 0.5
                        }}
                        fontSize="small"
                      />
                      {formatDistance(subHours(new Date(), 125), new Date(), {
                        addSuffix: true
                      })}
                    </Typography>
                  </Box>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 50,
                      height: 50
                    }}
                    alt={user.name}
                    src={user.avatar}
                  />
                </Box>
                )
            })}
      {/*  Message Receive */}
      {/* <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-start"
        py={3}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 50,
            height: 50
          }}
          alt="Zain Baptista"
          src="/static/images/avatars/2.jpg"
        />
        <Box
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="flex-start"
          ml={2}
        >
          <CardWrapperSecondary>
            Hi. Can you send me the missing invoices asap?
          </CardWrapperSecondary>
          <Typography
            variant="subtitle1"
            sx={{
              pt: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ScheduleTwoToneIcon
              sx={{
                mr: 0.5
              }}
              fontSize="small"
            />
            {formatDistance(subHours(new Date(), 115), new Date(), {
              addSuffix: true
            })}
          </Typography>
        </Box>
      </Box> */}
      {/*  Message Send */}
      {/* <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        py={3}
      >
        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
          justifyContent="flex-end"
          mr={2}
        >
          <CardWrapperPrimary>
            Yes, I'll email them right now. I'll let you know once the remaining
            invoices are done.
          </CardWrapperPrimary>
          <Typography
            variant="subtitle1"
            sx={{
              pt: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ScheduleTwoToneIcon
              sx={{
                mr: 0.5
              }}
              fontSize="small"
            />
            {formatDistance(subHours(new Date(), 125), new Date(), {
              addSuffix: true
            })}
          </Typography>
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            width: 50,
            height: 50
          }}
          alt={user.name}
          src={user.avatar}
        />
      </Box> */}
    </Box>
  );
}

export default ChatContent;
